
const store = require('./InternalModulesCache');
const loader = require('../util/loader');

const PRIVATE = new WeakMap();

class Controller {
  constructor(url, delegate) {
    PRIVATE.set(this, {
      url,
      context: {}
    });

    if (delegate) {
      delegate.call(this);
    }

    store.instance().controllers.set(url, this);
  }

  get ctx() {return PRIVATE.get(this).context}

  static lookupControllerInstance(url) {
    let path = `controllers/${url}`;
    return store.instance().lookup(store.MODULE_TYPE.controller, url, path);
  }
}

module.exports = Controller;
