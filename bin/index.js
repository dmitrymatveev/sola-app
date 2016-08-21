
const $ = window.$ = require('jquery');
$.Handlebars = require('handlebars');

require('./util/promise.auto');
require('./util/promise.hash');

const Application = require('./src/Application');
const Route = require('./src/Route');

const app = Application.instance();

$.SolaApp = {
  Route
};

// $.Handlebars.registerPartial(
//   'outlet',
//   "<div></div>"
// );

$.Handlebars.registerHelper('outlet', function () {
  console.log(this);
  return 'here';
});

window.onload = function () {
  app.start();
};
