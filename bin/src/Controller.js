
const store = require('./InternalModulesCache');
const loader = require('../util/loader');

const PRIVATE = new WeakMap();

class Controller {
  constructor(url, delegate) {
    PRIVATE.set(this, {
      url,
      context: {foo:'boo'}
    });

    if (delegate) {
      delegate.call(this);
    }

    store.instance().controllers.set(url, this);
  }

  get url() {return PRIVATE.get(this).url}
  get ctx() {return PRIVATE.get(this).context}

  static lookupControllerInstance(url) {
    let path = `controllers/${url}`;
    return store.instance().lookup(store.MODULE_TYPE.controller, url, path);
  }
}

module.exports = Controller;
