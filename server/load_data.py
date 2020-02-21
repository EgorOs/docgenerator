import os
import json
import logging
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


def upload_data():
    """
    Goes to directory with documents and uploads theirs data to MongoDB
    Returns:
        logging.info: info about successful complete
    """
    collection = connect_to_db()
    for file in get_full_path_to_documents():
        data = []
        with open(file) as document:
            doc = json.load(document)
        for main_key in doc:
            if main_key == 'Tags.contents':
                data.append(
                    {'type': 'test_1',
                     'value': doc[main_key]
                     })
            if main_key == 'tags':
                for key in doc[main_key]:
                    if 'date' in key['type'].lower():
                        data.append(
                            {'type': 'test_1_date',
                             'value': key.get('mainForm')
                             })
                    if 'natürlichepersonen' in key['type'].lower():
                        data.append(
                            {'type': 'test_1_legalname',
                             'value': key.get('mainForm')
                             })
                    if 'juristischepersonen' in key['type'].lower():
                        data.append(
                            {'type': 'test_1_name',
                             'value': key.get('mainForm')
                             })
        result = collection.insert_many(data)
        logging.info(f'Uploaded successfully, inserted_ids : {result.inserted_ids}')
    return 'All done'


if __name__ == '__main__':
    upload_data()
