import os
from pathlib import Path
import csv
import json
from math import ceil
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options


class DocumentGenerator:
    def __init__(self, driver, dataset_path="dataset"):
        self.driver = driver
        self.data_path = Path(dataset_path) / "img"
        self.coord_path = Path(dataset_path) / "coordinates"
        self.areas_path = Path(dataset_path) / "areas"

    def _generate_single(
            self,
            filename,
            url,
            window_width,
            window_height,
            scale_factor,
    ):
        """ 
        Generates a single element of dataset, that includes image, CSV with coordinates of tokens,
        JSON with coordinates of labelled areas
        """
        self.driver.get(url)
        self.driver.set_window_size(
            window_width * scale_factor, window_height * scale_factor
        )

        # Scale the page to get high resolution document
        # works properly only for browser in headless mode
        self.driver.execute_script(f"document.body.style.zoom='{scale_factor * 100}%'")
        self.driver.save_screenshot(str(self.data_path / f'{filename}.png'))

        self.area_labels = [
            "body", 
            "briefpost_header", 
            "email_header", 
            "doc_info", 
            "footer", 
            "logo", 
            "reference_to", 
            "reference_from", 
            "signature", 
            "email", 
            "fax", 
            "briefpost"
        ]

        areas_dict = self.create_areas_dict(f'{filename.split(".")[0]}', scale_factor)

        with open(self.areas_path / f'{filename}.json', "w") as result:
            result.write(json.dumps(areas_dict, indent=2))

        df = self.get_dataframe(areas_dict, scale_factor)
        df.to_csv(self.coord_path /f'{filename}.csv', sep=',', index=False)

    def _make_dirs(self):
        os.makedirs(str(self.data_path), exist_ok=True)
        os.makedirs(str(self.coord_path), exist_ok=True)
        os.makedirs(str(self.areas_path), exist_ok=True)

    def element_belongs_to_area(self, element, areas_dict, area_label, scale_factor):
        tags = areas_dict.get('tags')
        if not tags:
            return False
        areas = [a for a in tags if a.get('type') == area_label]
        elem_min_x = ceil(element.location['x'] * scale_factor)
        elem_max_x = ceil(element.location['x'] * scale_factor) + ceil(element.size['width'] * scale_factor)
        elem_min_y = ceil(element.location['y'] * scale_factor)
        elem_max_y = ceil(element.location['y'] * scale_factor) + ceil(element.size['height'] * scale_factor)

        for a in areas:
            area_min_x = a['coords']['x']
            area_max_x = a['coords']['x'] + a['coords']['width']
            area_min_y = a['coords']['y']
            area_max_y = a['coords']['y'] + a['coords']['height']
            if elem_min_x >= area_min_x and elem_max_x <= area_max_x and \
               elem_min_y >= area_min_y and elem_max_y <= area_max_y:
               return True
        return False

    def get_dataframe(self, areas_dict, scale_factor):
        """
        Find all elements with 'token' class and create a row with:
        offset = 0 | content | x | y | width | height | label
        """
        elements = self.driver.find_elements_by_class_name("token")
        data = {
            'offset':   [0] * len(elements),
            'word':     [element.text for element in elements],
            'x':        [ceil(element.location['x'] * scale_factor) for element in elements],
            'y':        [ceil(element.location['y'] * scale_factor) for element in elements],
            'width':    [ceil(element.size['width'] * scale_factor) for element in elements],
            'height':   [ceil(element.size['height'] * scale_factor) for element in elements],
            'label':    [element.get_attribute('label') for element in elements],
            'label2':    [element.get_attribute('label') for element in elements],
        }

        # Add area labels
        present_labels = [l.get('type') for l in areas_dict.get('tags')] if areas_dict.get('tags') else []
        data.update({a_label: 
            [1 if self.element_belongs_to_area(e, areas_dict, a_label, scale_factor) else 0 for e in elements]
            if a_label in present_labels else [0] * len(elements)     # if label not found in dict fill columnt with 0
            for a_label in self.area_labels})
        df = pd.DataFrame(data=data)
        return df

    def create_areas_dict(self, file_name, scale_factor):
        output = dict()
        page_size = self.driver.get_window_size()
        context = self.driver.find_element_by_id('context')
        output['class'] = context.get_attribute('doctype')
        output['pageSizes'] = [{
            'pw': page_size['width'],
            'ph': page_size['height'],
        }]
        tags = []
        for area_class in self.area_labels:
            elements = self.driver.find_elements_by_class_name(area_class)
            for element in elements:
                area_coords = {
                    'p': 1,
                    'x': ceil(element.location['x'] * scale_factor),
                    'y': ceil(element.location['y'] * scale_factor),
                    'width': ceil(element.size['width'] * scale_factor),
                    'height': ceil(element.size['height'] * scale_factor)
                }
                tag_info = {
                    'type': area_class,
                    'coords': area_coords
                }
                tags.append(tag_info)
        output['tags'] = tags
        return output

    def generate(
            self,
            n_samples,
            url="http://localhost:4200",
            window_width=1920,
            window_height=1080,
            scale_factor=1.5,
    ):
        self._make_dirs()
        for idx in range(290, n_samples):
            self._generate_single(
                str(idx), url, window_width, window_height, scale_factor
            )

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.driver.quit()


if __name__ == "__main__":

    width = 1920
    # A4 format
    height = width * 297 / 210

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size={},{}".format(width, height))
    driver = webdriver.Chrome(
        executable_path=os.getcwd() + "/chromedriver", options=chrome_options
    )

    document_gen = DocumentGenerator(driver)
    with document_gen as dg:
        dg.generate(300, window_width=width, window_height=height, scale_factor=1.8)
