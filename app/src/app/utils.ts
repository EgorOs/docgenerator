export const Randomization = {

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
  }

};

export const RandomizedCSSParser = {

  getRandomProperties(el: HTMLElement) {
    const randomProperties = [];
    for (let i = 0; i < el.attributes.length; i++) {
      if (el.attributes[i].name.startsWith('random-')) {
        randomProperties.push(el.attributes[i]);
      }
    }
    return randomProperties;
  },

  _toCamelCase(property: string) {
    let camelCase = '';
    for (const word of property.split('-')) {
      camelCase += word.charAt(0).toUpperCase() + word.slice(1);
    }
    camelCase = camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
    return camelCase;
  },

  _parseRandomInterval(interval: string) {
    const pattern = new RegExp('[\\-.0-9]*\\s*:\\s*[\\-.0-9]*');
    const range = interval.match(pattern)[0].split(':');
    const units = interval.replace(pattern, '');
    return {minVal: range[0], maxVal: range[1], units};
  },

  _setRandomIntervalProperty(el: HTMLElement, property) {
    const camelCaseName = this._toCamelCase( property.name.replace('random-interval-', ''));
    const intervalObj = this._parseRandomInterval(property.value);
    el.style[camelCaseName] = Randomization.getRandomIntInclusive(intervalObj.minVal,
                                                                  intervalObj.maxVal) + intervalObj.units;
  },

  _setRandomListProperty(el: HTMLElement, property) {
    const camelCaseName = this._toCamelCase(property.name.replace('random-list-', ''));
    const listObj = property.value.split(',');
    el.style[camelCaseName] = Randomization.getRandom(listObj) + '';
  },

  renderRandomizedStyle(el: HTMLElement) {
    const properties = this.getRandomProperties(el);
    for (const prop of properties) {
      if (prop.name.startsWith('random-interval-')) {
        this._setRandomIntervalProperty(el, prop);
      } else if (prop.name.startsWith('random-list-')) {
        this._setRandomListProperty(el, prop);
      }
    }
  },

  renderRandomizedStyleRecursively(el: HTMLElement) {
    this.renderRandomizedStyle(el);
    for (const elem in el.children) {
        this.renderRandomizedStyleRecursively(elem);
    }
  }
};
