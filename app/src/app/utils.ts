import {element} from "protractor";

export const Randomization = {

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  },

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

};

export const RandomizedCSSParser = {

  getRandomProperties(el: HTMLElement) {
    let randomProperties = [];
    for (let i = 0; i < el.attributes.length; i++) {
      if (el.attributes[i].name.startsWith('random-')) {
        randomProperties.push(el.attributes[i]);
      }
    }
    return randomProperties;
  },
  _toCamelCase(property: string) {
    let camel_case = '';
    for (let word of property.split('-')) {
      camel_case += word.charAt(0).toUpperCase() + word.slice(1);
    }
    camel_case = camel_case.charAt(0).toLowerCase() + camel_case.slice(1);
    return camel_case;
  },
  _randomInterval(interval: string) {
    const pattern = new RegExp('[0-9]*\-[0-9]*');
    const range = interval.match(pattern)[0].split('-');
    const units = interval.replace(pattern, '');
    return {minVal: range[0], maxVal: range[1], units: units};
  },
  _setRandomIntervalProperty(el: HTMLElement, property) {
    const camelCaseName = this._toCamelCase( property.name.replace('random-interval-', ''));
    const intervalObj = this._randomInterval(property.value);
    el.style[camelCaseName] = Randomization.getRandomIntInclusive(intervalObj.minVal,
                                                                  intervalObj.maxVal) + intervalObj.units;
  },
  renderRandomizedStyle(el: HTMLElement) {
    let properties = this.getRandomProperties(el);
    for (let prop of properties) {
      if (prop.name.startsWith('random-interval-')) {
        this._setRandomIntervalProperty(el, prop);
      }
    }
  },
  renderRandomizedStyleRecursively(el: HTMLElement) {
    this.renderRandomizedStyle(el);
    for (let elem of el.children) {
        this.renderRandomizedStyleRecursively(elem);
    }
  }
};
