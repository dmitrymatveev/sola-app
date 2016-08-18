
const singleton = require('../util/singleton');
const loader = require('../util/loader');

const MODULE_TYPE = {
  route: { ref: 'routes', loader: loader.loadScript },
  template: { ref: 'templates', loader: loader.loadTemplate },
  controller: { ref: 'controllers', loader: loader.loadScript }
};
Object.freeze(MODULE_TYPE);

class InternalModulesCache {
  constructor() {
    singleton.ensureSingletonConstructor(InternalModulesCache);

    this.routes = new Map();
    this.templates = new Map();
    this.controllers = new Map();
  }

  static get MODULE_TYPE() { return MODULE_TYPE }

  /**
   * @returns {InternalModulesCache}
   */
  static instance() {
    return singleton.lookupInstance(InternalModulesCache);
  }

  lookup(type, id, remotePath) {
    let store = this[type.ref];
    return new Promise(function (resolve, reject) {
      if (store.has(id)) {
        resolve(store.get(id))
      }
      else {
        type.loader(remotePath)
          .then(function (data) {
            if (data !== undefined) {
              resolve(data);
            }
            else if (store.has(id)) {
              resolve(store.get(id))
            }
            else {
              reject(new Error(`Module id:'${id}' at: ${remotePath} not found`))
            }
          })
          .catch(reject);
      }
    })
  }
}

singleton.setClassSingleton(InternalModulesCache);
module.exports = InternalModulesCache;
