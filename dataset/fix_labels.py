import pandas as pd
import json
from pathlib import Path
import os


dataset_path = 'dataset'
coord_path = Path(dataset_path) / "prepared_csv"
prepared_csv = Path(dataset_path) / "fixed_labels_csv_2"

person_labels = ['NaturlichePersonen', 'JuristischePersonen']
date_labels = ['DocDate']


def convert():
    os.makedirs(str(prepared_csv), exist_ok=True)
    csv_files = [f for f in os.listdir(coord_path) if not f.startswith('.~')]
    for csv_filename in csv_files:

        df = pd.read_csv(coord_path / csv_filename)

        label_lst = []
        label2_lst = []
        person_count = 0
        date_count = 0

        # if csv_filename != '101.csv':
        #     continue
        for row in df.iterrows():

            label = row[1]['label']

            if label == 'O':
                label_lst.append(label)
                label2_lst.append(label)
                continue

            label_prefix, label_base = label.split('-')

            if label_base in person_labels:
                if person_count < 2:
                    label_lst.append('-'.join((label_prefix, 'DocInvolvedParty')))
                    label2_lst.append(label)
                    if label_prefix == 'B':
                        person_count += 1
                elif person_count == 2:
                    if label_prefix == 'B':
                        person_count += 1
                        label_lst.append(label)
                        label2_lst.append('O')
                    else:
                        label_lst.append('-'.join((label_prefix, 'DocInvolvedParty')))
                        label2_lst.append(label)
                else:
                    label_lst.append(label)
                    label2_lst.append('O')
            elif label_base in date_labels:
                if (date_count == 0 and label_prefix == 'B') or (date_count <= 1 and label_prefix == 'I'):
                    label_lst.append(label)
                    label2_lst.append(label)
                else:
                    label_lst.append('O')
                    label2_lst.append('O')

                if label_prefix == 'B':
                    date_count += 1   
            else:
                label_lst.append(label)
                label2_lst.append(label)

        # print(len(label_lst), len(list(df.iterrows())))
        label_column = pd.Series(label_lst, name='label')
        label2_column = pd.Series(label2_lst, name='label2')
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
        df.to_csv(prepared_csv / csv_filename, sep=',', index=False)


if __name__ == "__main__":
    convert()