from flask import Flask
from pymongo import MongoClient
import json
from random import choice
from flask_cors import CORS
import re
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['docgen']
collection = db['docgen2']


def tokenize(text):
    text = text.replace('\n', ' ')
    return text.split()


def wrap_entity(text, label_1, label_2):
    words = tokenize(text)
    content = ''
    for i, w in enumerate(words):
        prefix = 'B' if i == 0 else 'I'
        full_label_1 = f'{prefix}-{label_1}'
        full_label_2 = 'O' if label_2 == 'O' else f'{prefix}-{label_2}'
        content += f'<span class="token" label="{full_label_1}" label2="{full_label_2}">{w}</span>' + ' '
    return f'<span class="entity">{content}</span>'


def wrap_element_contents(soup, elem):
    text = elem.string
    words = tokenize(text)
    elem.clear()
    for w in words: 
        span = soup.new_tag('span', **{'class':'token' , 'label': 'O', 'label2': 'O'})
        span.string = w
        elem.append(span)


def wrap_content(text):
    exclude_tokens = {f'<%{e}%>' for e in re.findall(r'<%([\w#]*)%>', text)}
    words = tokenize(text)
    content = ''
    for w in words:
        if w in exclude_tokens:
            content += w + ' '
        else:
            content += f'<span class="token" label="O" label2="O">{w}</span>' + ' '
    return content


def get_entity_labels(entity):
    if entity['template_name'] == 'doc_involved_party':
        return ('DocInvolvedParty', entity['original_name'])
    else:
        return (entity['original_name'], 'O')

class TemplateRenderer:
    def __init__(self, collection, random_seed='', obj_type='template', tags=[]):
        self.collection = collection
        self.obj_type = obj_type

    def get_template(self):
        return list(self.collection.aggregate(
        [   
            {'$match': {'type': self.obj_type}},
            {'$sample': {'size': 1}},
        ]))[0]['template']

    # def get_entity_types(self):
    #     return list(collection.aggregate(
    #     [   
    #         {'$match': {'template_name': self.obj_type}},
    #         {'$sample': {'size': 1}},
    #     ]))[0]['template']

    def get_content(self):
        return list(self.collection.aggregate(
        [   
            {'$match': {'type': 'content'}},
            {'$sample': {'size': 1}},
        ]))[0]['value']


    def get_entity_value(self, entity):
        name = entity.partition('#')[0]
        response = list(self.collection.aggregate(
        [   
            {'$match': {'type': 'entity', 'template_name': name}},
            {'$sample': {'size': 1}},
        ]))
        if response:
            entity = response[0]
            value = entity['value']
            label_1, label_2 = get_entity_labels(entity)
            return wrap_entity(value, label_1, label_2)
        return f'''<span style="background: #C3272B"><%{entity}%></span>'''

    @staticmethod
    def _render_arbitrary_text(template):
        soup = BeautifulSoup(template)
        text_spans = soup.findAll("span", {"class": "gen-arbitrary-text"})
        new_tag = soup.new_tag("span", href="http://www.example.com")
        for span in text_spans:
            wrapped = wrap_element_contents(soup, span)
        return soup.prettify()

    def render(self):
        template = self.get_template()
        if re.search(r'\[%content%\]', template):
            content = self.get_content()
            content = wrap_content(content)
            template = template.replace(f'[%content%]', content)

        # entities_dict = {e: self.get_entity_value(e) for e in re.findall(r'<%([\w#]*)%>', template)}
        # for entity, value in entities_dict.items():
        #     template = template.replace(f'<%{entity}%>', value)

        doc_inv_party_dict = {e: self.get_entity_value(e) for e in re.findall(r'<%([\w#]*)%>', template) if (e.startswith("doc_involved_party") or e.startswith("doc_due_date"))}
        for entity, value in doc_inv_party_dict.items():
            template = template.replace(f'<%{entity}%>', value)

        entities_lst = [(e, self.get_entity_value(e)) for e in re.findall(r'<%([\w#]*)%>', template) if not (e.startswith("doc_involved_party") or e.startswith("doc_due_date"))]
        for e in entities_lst:
            template = template.replace(f'<%{e[0]}%>', e[1], 1)

        template = self._render_arbitrary_text(template)
        return {'template': template}


tr = TemplateRenderer(collection)


@app.route("/document")
def user_profile():

    return tr.render()