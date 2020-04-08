import pandas as pd
import json
from pathlib import Path
import os


dataset_path = 'dataset'
coord_path = Path(dataset_path) / "coordinates"
areas_path = Path(dataset_path) / "areas"
coord_json_path = Path(dataset_path) / "coords_json"

label_mapping = {
        'naturname': 'NatürlichePersonen',
        'jurname': 'JuristischePersonen',
        'datetime': 'DocDate',
        'doctypecomm': 'DocTypeComm',
        'doctitle': 'DocTitle',
        'docinvolvedparty': 'DocInvolvedParty',
    }


def convert():
    csv_files = [f for f in os.listdir(coord_path) if not f.startswith('.~')]
    for csv_filename in csv_files:

        with open(areas_path / csv_filename.replace('csv', 'json'), 'r') as f:
            output = json.load(f)
            output['tags'] = []

        df = pd.read_csv(coord_path / csv_filename)
        df = df.dropna()
        contents = ' '.join(list(df['word']))
        output['Tags.contents'] = contents

        entities = df[df['label'] != 'O']
        prev_prefix = None
        for row in entities.iterrows():
            entity =row[1]
            prefix, original_type = entity['label'].split('-')

            if prev_prefix and prefix == 'B':
                output['tags'].append(entity_info)

            if prefix == 'B':
                entity_info = dict()
                entity_type = label_mapping[original_type] if label_mapping.get(original_type) else original_type
                entity_info['type'] = entity_type
                entity_info['mainForm'] = entity['word']
                coords = [
                    {
                        'p': 1,
                        'x': entity['x'],
                        'y': entity['y'],
                        'width': entity['width'],
                        'height': entity['height']

                    }
                ]
                entity_info['coords'] = coords
            elif prefix == 'I':
                x_diff = entity['x'] - coords[0]['x']
                coords[0]['width'] += x_diff + entity['width']
                entity_info['mainForm'] += ' ' + entity['word']

            if not prev_prefix:
                prev_prefix = prefix
                continue
            prev_prefix = prefix
        else:
            output['tags'].append(entity_info)
        os.makedirs(str(coord_json_path), exist_ok=True)
        with open(coord_json_path / csv_filename.replace('csv', 'json'), 'w') as f:
            f.write(json.dumps(output, indent=2))


if __name__ == "__main__":
    convert()