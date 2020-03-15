import os
from pathlib import Path
import csv
import json
from math import ceil

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
        self.driver.save_screenshot(str(self.data_path / filename))
        self._save_coordinates_to_file(f'coordinates_{filename.split(".")[0]}', scale_factor)

        areas = ["body", "briefpost_header", "email_header", "doc_info", "footer", "logo", "reference_to", "reference_from", "signature", "email", "fax", "briefpost"]
        self._save_areas_to_json(f'areas_{filename.split(".")[0]}', areas, scale_factor)

    def _make_dirs(self):
        os.makedirs(str(self.data_path), exist_ok=True)
        os.makedirs(str(self.coord_path), exist_ok=True)
        os.makedirs(str(self.areas_path), exist_ok=True)

    def describe_tokens(self, scale_factor):
        """
        Find all elements with 'token' class and create a row with:
        offset = 0 | content | x | y | width | height | label
        """
        elements = self.driver.find_elements_by_class_name("token")
        tokens_info = [
            [0] * len(elements),
            [element.text for element in elements],
            [ceil(element.location['x'] * scale_factor) for element in elements],
            [ceil(element.location['y'] * scale_factor) for element in elements],
            [ceil(element.size['width'] * scale_factor) for element in elements],
            [ceil(element.size['height'] * scale_factor) for element in elements],
            [element.get_attribute('label') for element in elements]
        ]
        list_transform = list(map(list, zip(*tokens_info)))  # transposed list
        return list_transform

    def _save_coordinates_to_file(self, file_name, scale_factor):
        """ Saves coordinates to CSV file """
        fieldnames = ['offset', 'word', 'x', 'y', 'width', 'height', 'label']
        with open(self.coord_path / f'{file_name}.csv', "w", newline="") as result:
            writer = csv.writer(result, delimiter=',')
            writer.writerow(fieldnames)
            writer.writerows(self.describe_tokens(scale_factor))

    def _save_areas_to_json(self, file_name, areas, scale_factor):
        output = dict()
        page_size = self.driver.get_window_size()
        output['class'] = 'NO_CLASS'
        output['pageSizes'] = [{
            'pw': page_size['width'],
            'ph': page_size['height'],
        }]
        tags = []
        for area_class in areas:
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
        with open(self.areas_path / f'{file_name}.json', "w") as result:
            result.write(json.dumps(output, indent=2))

    def generate(
            self,
            n_samples,
            url="http://localhost:4200",
            window_width=1920,
            window_height=1080,
            scale_factor=1.5,
    ):
        self._make_dirs()
        for idx in range(n_samples):
            self._generate_single(
                f"{idx}.png", url, window_width, window_height, scale_factor
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
        dg.generate(1, window_width=width, window_height=height, scale_factor=1.2)
