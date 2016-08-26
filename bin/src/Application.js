const Router = require('./Router');
const loader = require('../util/loader');
const singleton = require('../util/singleton');

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
    this.configureWindow();
    this.router.transition(location.hash.replace('#', ''));
  }

  configureWindow() {

    var div = $('<div></div>').attr('id', 'sla_0');
    $('body').append(div);

    window.addEventListener("unhandledrejection", (err, promise) => {
      // Handle any uncaught errors here
      // console.error(err);
    });

    window.addEventListener('hashchange', () => {
      this.router.transition(location.hash.replace('#', ''));
    });
  }
}

singleton.setClassSingleton(Application);
module.exports = Application;
