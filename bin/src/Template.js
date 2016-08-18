
const Hbs = require('handlebars');
const store = require('./InternalModulesCache');
const loader = require('../util/loader');

const PRIVATE = new WeakMap();

class Template {
  constructor(url, source) {
    PRIVATE.set(this, {
      url,
      template: Hbs.compile(source)
    });

    store.instance().templates.set(url, this);
  }

  get hbs() {return PRIVATE.get(this).template}

  static lookupTemplateInstance(url) {
    let path = `templates/${url}`;
    return store.instance().lookup(store.MODULE_TYPE.template, url, path).then(rawTemplate => {
      return new Template(url, rawTemplate);
    });
  }
}

module.exports = Template;
