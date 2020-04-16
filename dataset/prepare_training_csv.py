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
        # 'B-NatürlichePersonen': 'B-NaturlichePersonen',
        # 'I-NatürlichePersonen': 'I-NaturlichePersonen',
        # 'B-DocDate': 'B-DocDueDate',
        # 'I-DocDate': 'I-DocDueDate',
        'B-address': 'O',
        'B-phone': 'O',
        'B-fax': 'O',
        'B-email': 'O',
        'I-address': 'O',
        'I-phone': 'O',
        'I-fax': 'O',
        'I-email': 'O',
}

def convert():
    os.makedirs(str(prepared_csv), exist_ok=True)
    csv_files = [f for f in os.listdir(coord_path) if not f.startswith('.~')]
    for csv_filename in csv_files:

        df = pd.read_csv(coord_path / csv_filename)

        offset = 0
        offset_lst = []
        labels_lst = []
        labels2_lst = []
        for row in df.iterrows():

            offset_lst.append(offset)
            offset += len(str(row[1]['word'])) + 1
            label = row[1]['label']
            label2 = row[1]['label2']

            if label in replace_labels.keys():
                label = replace_labels[label]
            if label2 in replace_labels.keys():
                label2 = replace_labels[label2]
            labels_lst.append(label)
            labels2_lst.append(label2)


        offset_column = pd.Series(offset_lst, name='offset')
        label_column = pd.Series(labels_lst, name='label')
        label2_column = pd.Series(labels2_lst, name='label2')
        
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
         # 'body',
        # 'briefpost_header',
        # 'email_header',
        # 'doc_info',
        # 'footer',
        # 'logo',
        # 'reference_to',
        # 'reference_from',
        # 'signature'
        ]
        ]

        df = df.dropna()
        df.to_csv(prepared_csv / csv_filename, sep=',', index=False)


if __name__ == "__main__":
    convert()