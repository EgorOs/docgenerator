import json
import pymongo
import os
import logging
import re
from pathlib import Path
from pymongo import MongoClient


class Endpoint:
    def __init__(self, name, data, *args, **kwargs):
        self.name = name
        self.values = self.extract(data, *args, **kwargs)

    def extract(self, data):
        """ Define how to extract values from data """
        pass


class EntityCollection(Endpoint):
    def __init__(self, name, data, filename, entity_type):
        self._type = entity_type
        super().__init__(name, data, filename, entity_type)

    def extract(self, data, filename, entity_type):
        return [{
                'value': e.get('mainForm'),
                'type': 'entity',
                'template_name': self.name,
                'original_name': entity_type,
                'file': filename,
            }
                for e in data.get('tags') if e.get('type') == entity_type]


class DocInvolvedCollection(Endpoint):
    def __init__(self, name, data, filename, entity_type):
        self._type = 'DocInvolvedParty'
        super().__init__(name, data, filename, entity_type)

    def extract(self, data, filename, entity_type):
        return [{
                'value': e.get('mainForm'),
                'type': 'entity',
                'template_name': self.name,
                'original_name': entity_type,
                'file': filename,
            }
                for e in data.get('tags') if e.get('type') == entity_type]


class ContentCollection(Endpoint):
    def __init__(self, name, data, filename, type_to_name):
        super().__init__(name, data, filename, type_to_name)

    def extract(self, data, filename, type_to_name):
        content = data.get('Tags.contents')
        tags = data.get('tags')
        shortcuts = {e: chr(119552 + i) for i, e in enumerate(type_to_name.keys())}
        template = tokeize_main_text(content, tags, shortcuts, type_to_name)
        return [{
                'value': template,
                'type': 'content',
                'template_name': self.name,
                'file': filename,
            }
        ]


def tokeize_main_text(text, tags, shortcuts, type_to_name, escape_char='<%{}%>'):
    initial_len = len(text)
    for tag in tags:
        features = tag.get('features')
        if not features:
            continue
        if not tag['type'] in type_to_name.keys():
            # Filter out undefined tag types
            continue
        span = features['Entity.span']
        token_len = span['end'] - span['start']
        token = shortcuts[tag['type']].center(token_len, '_')
        text = text[:span['start']] + token + text[span['end']:]
        assert len(text) == initial_len
    for tag, shortcut in shortcuts.items():
        text = re.sub(
            r'_*{}_*'.format(shortcut), escape_char.format(type_to_name[tag]), text
        )
    return text


class Extractor:
    def __init__(self, dataset_path):
        self.dataset_path = Path(dataset_path)
        self.client = MongoClient('localhost', 27017)
        db = self.client.docgen  # get DataBase
        self.collection = db['docgen2']  # get documents collection

    def load(self):
        files_lst = os.listdir(self.dataset_path)
        for filename in files_lst:    
            with open(self.dataset_path / filename, 'r') as file:
                file_as_dict = json.load(file)
                entity_collections = [
                    EntityCollection('natur_personen', file_as_dict, filename, 'NatürlichePersonen'),
                    EntityCollection('jur_personen', file_as_dict, filename, 'JuristischePersonen'),
                    EntityCollection('doc_due_date', file_as_dict, filename, 'DocDueDate'),
                    EntityCollection('doc_date', file_as_dict, filename, 'DocDate'),
                    DocInvolvedCollection('doc_involved_party', file_as_dict, filename, 'NatürlichePersonen'),
                    DocInvolvedCollection('doc_involved_party', file_as_dict, filename, 'JuristischePersonen'),
                ]
                for coll in entity_collections:
                    if coll.values:
                        result = self.collection.insert_many(coll.values)
                        logging.info(f'Uploaded successfully, inserted_ids : {result.inserted_ids}')

                type_to_name = {e._type: e.name for e in entity_collections}
                content = ContentCollection('content', file_as_dict, filename, type_to_name)


                # Inset non-empty contents
                for cont in content.values:
                    if cont.get('value'):
                        result = self.collection.insert_many(content.values)


class TemplateLoader:
    def __init__(self, templates_path):
        self.templates_path = Path(templates_path)
        self.client = MongoClient('localhost', 27017)
        db = self.client.docgen  # get DataBase
        self.collection = db['docgen2']  # get documents collection

    def load(self):
        files_lst = os.listdir(self.templates_path)
        for filename in files_lst:    
            with open(self.templates_path / filename, 'r') as file:
                self.collection.insert_one({
                        'type': 'template',
                        'template': file.read()
                    })


if __name__ == '__main__':
    # filename = '/home/egor/docgen2/server/data/Akte_01_-_002.json'
    # with open(filename, 'r') as file:
    #     file_as_dict = json.load(file)
    #     nat_person_coll = EntityCollection('natur_personen', file_as_dict, filename, 'NatürlichePersonen')
    #     doc_due_date_coll = EntityCollection('doc_due_date', file_as_dict, filename, 'DocDueDate')
    #     doc_inv_coll = DocInvolvedCollection('doc_due_date', file_as_dict, filename, 'NatürlichePersonen')
    #     content = ContentCollection('content', file_as_dict, filename, ['NatürlichePersonen', 'DocDueDate', 'DocDate'])
    #     print(content.values)

    ext = Extractor('data')
    ext.load()
    template_ldr = TemplateLoader('templates')
    template_ldr.load()
