
const $ = window.$ = require('jquery');
$.Handlebars = require('handlebars');
require('./util/promise');

const Application = require('./src/Application');
const Route = require('./src/Route');

const app = Application.instance();

$.SolaApp = {
  Route
};

$.Handlebars.registerPartial(
  'outlet',
  "<div>outlet</div>"
);

window.onload = function () {
  app.start();
};

window.addEventListener("unhandledrejection", function(err, promise) {
  // Handle any uncaught errors here
  // console.error(err);
});
