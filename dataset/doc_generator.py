from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os
from pathlib import Path
from selenium.webdriver.chrome.options import Options  

import cv2
import imutils
import json


class DocumentGenerator:
    def __init__(self, driver, dataset_path='dataset'):
        self.driver = driver
        self.data_path = Path(dataset_path) / 'img'
        self.mask_path = Path(dataset_path) / 'mask'
        
    def _generate_single(self,
                 filename,
                 url='http://localhost:4200', 
                 window_width=1920, 
                 window_height=1080, 
                 scale_factor=1.5):
                 
        self.driver.get(url)
        self.driver.set_window_size(window_width * scale_factor,
                               window_height * scale_factor)
        self.driver.execute_script("document.body.style.zoom='{}%'".format(scale_factor * 100))
        self.driver.save_screenshot(str(self.data_path / filename))

        body_element = self.driver.find_element_by_tag_name('body')
        body_element.click()
        self.driver.save_screenshot(str(self.mask_path / filename))
    
    def _make_dirs(self):
        os.makedirs(str(self.data_path), exist_ok=True)
        os.makedirs(str(self.mask_path), exist_ok=True)
    
    def generate(self,
                 n_samples,
                 url='http://localhost:4200', 
                 window_width=1920, 
                 window_height=1080, 
                 scale_factor=1.5):
        
        self._make_dirs()
        for idx in range(n_samples):
            self._generate_single('%s.png' % idx,
                 url, window_width, 
                 window_height, scale_factor)
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.driver.quit()


class LabelGenerator:
    def __init__(self, dataset_path="dataset"):
        self.mask_path = Path(dataset_path) / 'mask'
        self.labels_path = Path(dataset_path) / 'labels'
        self.label_descriptions = {
            "content": ((0,0,140), (10, 255, 255)),
            "contact": ((50,50,130), (80, 255, 255)),
            "docfrom": ((0,124,0), (60, 130, 124)),
            "logo": ((0,190,0), (140, 255, 110)),
        }

    def _find_colored_areas(self, img, lower_threshold, upper_threshold):
        mask = cv2.inRange(img, lower_threshold, upper_threshold)
        cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)
        return imutils.grab_contours(cnts)

    def _areas_post_process(self, areas):
        # Leave only 2 diagonal points, turn array to list
        return [[(int(i[0]), int(i[1])) for i in (tuple(a[0][0]), tuple(a[2][0]))] for a in areas]

    def generate(self):
        os.makedirs(str(self.labels_path), exist_ok=True)
        for mask in os.listdir(self.mask_path):
            img = cv2.imread(str(self.mask_path / mask))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            hsv_img = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
            img_labels = {}
            for label, thresholds in self.label_descriptions.items():
                lower, upper = thresholds
                areas = self._find_colored_areas(img, lower, upper)
                img_labels[label] = self._areas_post_process(areas)
                fname = mask.replace('png', 'json')
                with open(str(self.labels_path / fname), 'w') as f:
                    as_json = json.dumps(img_labels)
                    f.write(as_json)


if __name__ == "__main__":
    chrome_options = Options()  
    chrome_options.add_argument("--headless")  

    driver = webdriver.Chrome(executable_path=os.getcwd()+'/chromedriver', options=chrome_options)

    document_gen = DocumentGenerator(driver)
    with document_gen as dg:
        dg.generate(10)
        pass

    lg = LabelGenerator()
    lg.generate()