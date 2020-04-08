import os
import json
import logging
import re
from pathlib import Path


import pymongo
from pymongo import MongoClient


def connect_to_db():
    """
    Connects to MongoDB
    Returns: documents collection

    """
    client = MongoClient('localhost', 27017)
    db = client.docgen  # get DataBase
    documents = db['documents']  # get documents collection
    return documents


def get_full_path_to_documents():
    """
    Gets the full path to documents
    Returns:
        List of full paths of documents
    """
    input_path = Path(__file__).absolute().parents[0] / "data"
    files = list(map(lambda x: f"{input_path}/{x}", os.listdir(input_path)))
    return files


def tokeize_main_text(text, tags, escape_char='<%{}%>'):
    initial_len = len(text)
    tags_shortcuts = {
        'naturname': u'\u1234',
        'jurname': u'\u1235',
        'datetime': u'\u1236',
        'docinvolvedparty-n': u'\u1237',
        'docinvolvedparty-j': u'\u1238',
    }
    for tag in tags:
        span = tag['span']
        token_len = span['end'] - span['start']
        token = tags_shortcuts[tag['type']].center(token_len, '_')
        text = text[:span['start']] + token + text[span['end']:]
        assert len(text) == initial_len
    for tag, shortcut in tags_shortcuts.items():
        text = re.sub(
            r'_*{}_*'.format(shortcut), escape_char.format(tag), text
        )
    return text


def upload_data():
    """
    Goes to directory with documents and uploads theirs data to MongoDB
    Returns:
        logging.info: info about successful complete
    """
    doc_inv_pattern = 'docinvolvedparty-{}'
    db_values = {
        'NatürlichePersonen': 'naturname',
        'JuristischePersonen': 'jurname',
        'DocDueDate': 'datetime',
        'DocDate': 'datetime',
        'DocTypeComm': 'doctypecomm',
        'DocTitle': 'doctitle',
        'DocInvolvedParty': 'docinvolvedparty',
    }
    in_text_values = {
        'NatürlichePersonen': 'naturname',
        'JuristischePersonen': 'jurname',
        'DocDueDate': 'datetime',
        'DocInvolvedParty': 'docinvolvedparty',
    }

    collection = connect_to_db()
    for file in get_full_path_to_documents():
        data = []
        span_data = []
        content = ''
        with open(file) as document:
            doc = json.load(document)
        doc_inv = []
        for main_key in doc:
            if main_key == 'Tags.contents':
                content = doc[main_key]
            if main_key == 'tags':
                for key in sorted(doc[main_key], key=lambda x: x['type']):
                    if key['type'] in db_values:
                        if key['type'] in in_text_values:
                            span = key['features']['Entity.span']
                            tag_type = db_values[key['type']]
                            token_type = tag_type
                            if key['type'] in (
                                    'NatürlichePersonen', 'JuristischePersonen'
                            ):
                                for ent in doc_inv:
                                    if (
                                        span["start"] == ent["span"]["start"]
                                        and span["end"] == ent["span"]["end"]
                                    ):
                                        token_type = doc_inv_pattern.format(key['type'][0].lower())
                                        ent['type'] = tag_type
                            ent = {
                                'type': token_type,
                                'span': span,
                                'value': key['mainForm']
                            }
                            if key['type'] == 'DocInvolvedParty':
                                doc_inv.append(ent)
                            else:
                                span_data.append(ent)
                                data.append({
                                    'type': tag_type,
                                    'value': key['mainForm'],
                                    'document': file.rpartition('/')[-1],
                                    'originalType': key['type'],
                                })

                        else:
                            data.append({
                                'type': db_values[key['type']],
                                'value': key['mainForm'],
                                'document': file.rpartition('/')[-1],
                                'originalType': key['type'],
                            })
        data.append(
            {
                'type': 'content',
                'value': tokeize_main_text(content, span_data),
                'document': file.rpartition('/')[-1],
            }
        )


        result = collection.insert_many(data)

        logging.info(f'Uploaded successfully, inserted_ids : {result.inserted_ids}')
    return 'All done'


if __name__ == '__main__':
    upload_data()
