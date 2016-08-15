var Router = require('./Router');
var loader = require('../util/loader');

class Application {
  constructor() {
    console.log('SolaApp: v0.0.1-dev');
    this.onReady = () => {};
    this.router = new Router();
  }
}

let instance;
Application.instance = function () {
  return instance ? instance : instance = new Application();
};

Application.start = function () {
  let app = Application.instance();
  window.onload = app.onReady;
};

module.exports = Application;
