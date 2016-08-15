let Application = require('./src/Application');
let Route = require('./src/Route');
let loader = require('./util/loader');

Application.instance().onReady = function () {
  loader.loadScript('index.js')
    .then(function () {
      Application.instance().router.transition('index');
    });
};

var $ = require('jquery');
$.Handlebars = require('handlebars');
$.SolaApp = {
  Route
};

window.$ = $;

Application.start();
