import os
from pathlib import Path
import csv
from math import ceil

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options


class DocumentGenerator:
    def __init__(self, driver, dataset_path="dataset"):
        self.driver = driver
        self.data_path = Path(dataset_path) / "img"
        self.mask_path = Path(dataset_path) / "mask"
        self.tokens_coord = Path(dataset_path) / "coordinates"

    def _generate_single(
            self,
            filename,
            url="http://localhost:4200",
            window_width=1920,
            window_height=1080,
            scale_factor=1.5,
    ):
        self.driver.get(url)
        self.driver.set_window_size(
            window_width * scale_factor, window_height * scale_factor
        )
        self.driver.execute_script(f"document.body.style.zoom='{scale_factor * 100}%'")
        self.driver.save_screenshot(str(self.data_path / filename))

        body_element = self.driver.find_element_by_tag_name("body")
        body_element.click()
        self.driver.save_screenshot(str(self.mask_path / filename))
        self._save_coordinates_to_file(f'coordinates_{filename.split(".")[0]}')

    def _make_dirs(self):
        os.makedirs(str(self.data_path), exist_ok=True)
        os.makedirs(str(self.mask_path), exist_ok=True)
        os.makedirs(str(self.tokens_coord), exist_ok=True)  # make dir for file with coordinates for tokens

    def _get_tokens_info(self):
        elements = self.driver.find_elements_by_class_name("token")
        tokens_info = [
            [0] * len(elements),
            [element.text for element in elements],
            [element.location['x'] for element in elements],
            [element.location['y'] for element in elements],
            [ceil(element.size['width']) for element in elements],
            [ceil(element.size['height']) for element in elements],
            ['O'] * len(elements)
        ]
        list_transform = list(map(list, zip(*tokens_info)))  # transposed list
        return list_transform

    def _save_coordinates_to_file(self, file_name="coordinates"):
        """Saves coordinates to CSV file"""
        fieldnames = ['offset', 'word', 'x', 'y', 'width', 'height', 'label']
        with open(self.tokens_coord / f'{file_name}.csv', "w", newline="") as result:
            writer = csv.writer(result, delimiter=',')
            writer.writerow(fieldnames)
            writer.writerows(self._get_tokens_info())

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
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(
        executable_path=os.getcwd() + "/chromedriver", options=chrome_options
    )

    document_gen = DocumentGenerator(driver)
    with document_gen as dg:
        dg.generate(10)
        pass
