var Router = require('./Router');
var loader = require('../util/loader');
var singleton = require('../util/singleton');
const runtime = require('./runtime');

class Application {
  constructor() {
    singleton.ensureSingletonConstructor(Application);
    console.log('SolaApp: v0.0.1-dev');
    this.router = new Router();
  }

  /** @returns {Application} */
  static instance() {
    return singleton.lookupInstance(Application);
  }

  start() {
    this.router.transition('index');
  }
}

singleton.setClassSingleton(Application);
module.exports = Application;
