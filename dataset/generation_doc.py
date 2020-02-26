import os
from pathlib import Path
import json
import csv
from math import ceil
import logging

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
        self._save_coordinates_to_file()

    def _make_dirs(self):
        os.makedirs(str(self.data_path), exist_ok=True)
        os.makedirs(str(self.mask_path), exist_ok=True)
        os.makedirs(str(self.tokens_coord), exist_ok=True)  # make dir for file with coordinates for tokens

    def _find_tokens_coordinates(self):
        elements = self.driver.find_elements_by_class_name("token")
        dirty_coordinates = [
            [
                sum(elem)
                for elem in zip(element.location.values(), element.size.values())
            ]
            for element in elements
        ]
        for i in range(len(dirty_coordinates)):
            dirty_coordinates[i] = list(map(ceil, dirty_coordinates[i]))
        return dirty_coordinates

    def _save_coordinates_to_file(self, file_name="coordinates", ext="csv"):
        """Saves coordinates to JSON or CSV file"""
        if ext == "json":
            with open(
                self.tokens_coord / ".".format(file_name, ext), "w", encoding="utf-8"
            ) as result:
                json.dump(self._find_tokens_coordinates(), result)
        elif ext == "csv":
            with open(
                self.tokens_coord / ".".format(file_name, ext),
                "w",
                newline="",
            ) as result:
                writer = csv.writer(result, delimiter=",")
                writer.writerows(self._find_tokens_coordinates())
        else:
            logging.error("Unsupported extension")

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
    driver = webdriver.Firefox(
        executable_path=os.getcwd() + "/chromedriver", options=chrome_options
    )

    document_gen = DocumentGenerator(driver)
    with document_gen as dg:
        dg.generate(10)
        pass
