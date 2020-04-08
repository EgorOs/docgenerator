import pandas as pd
import json
from pathlib import Path
import os


dataset_path = 'dataset'
coord_path = Path(dataset_path) / "coordinates"
prepared_csv = Path(dataset_path) / "prepared_csv"

label_mapping = {
        'naturname': 'NaturlichePersonen',
        'jurname': 'JuristischePersonen',
        'datetime': 'DocDate',
        'datetime': 'DocDate',
        'doctypecomm': 'DocTypeComm',
        'doctitle': 'DocTitle',
        'docinvolvedparty': 'DocInvolvedParty',

        # To be removed
        'name': 'NaturlichePersonen',
    }

replace_labels = {
        'address': 'O',
        'phone': 'O',
        'fax': 'O',
        'email': 'O',
}

def convert():
    os.makedirs(str(prepared_csv), exist_ok=True)
    csv_files = [f for f in os.listdir(coord_path) if not f.startswith('.~')]
    for csv_filename in csv_files:

        df = pd.read_csv(coord_path / csv_filename)

        offset = 0
        offset_lst = []
        labels_lst = []
        for row in df.iterrows():

            offset_lst.append(offset)
            offset += len(str(row[1]['word'])) + 1
            label = row[1]['label']
            if label == 'O':
                labels_lst.append(label)
                continue

            # print(csv_filename, label, row[1]['word'])
            label_prefix, label_base = label.split('-')
            if label_base in replace_labels:
                labels_lst.append('O')
            else:
                labels_lst.append('-'.join((label_prefix, label_mapping[label_base])))


        offset_column = pd.Series(offset_lst, name='offset')
        label_column = pd.Series(labels_lst, name='label')
        label2_column = pd.Series(labels_lst, name='label2')
        
        df.update(offset_column)
        df.update(label_column)
        df.update(label2_column)

        df = df[['offset',
         'word',
         'x',
         'y',
         'width',
         'height',
         'label',
         'label2',
         'body',
        'briefpost_header',
        'email_header',
        'doc_info',
        'footer',
        'logo',
        'reference_to',
        'reference_from',
        'signature']
        ]

        df = df.dropna()
        df.to_csv(prepared_csv / csv_filename, sep=',', index=False)


if __name__ == "__main__":
    convert()