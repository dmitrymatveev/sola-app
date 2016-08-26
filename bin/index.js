
const $ = window.$ = require('jquery');
$.Handlebars = require('handlebars');

require('./util/promise/all');

const string = require('./util/string');

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
  var tpl = `<div id="sla_${string.hashCode(this.url)}"></div>`;
  return new $.Handlebars.SafeString(tpl);
});

window.onload = function () {
  app.start();
};
