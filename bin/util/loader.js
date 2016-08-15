var Hbs = require('handlebars');
var $ = require('jquery');

module.exports = {
  loadScript(path) {
    return new Promise(function (res, rej) {
      $.getScript(path)
        .done(res)
        .fail(rej);
    })
  },

  loadTemplate(path) {
    return new Promise(function (res, rej) {
      $.get(path)
        .done(data => res(Hbs.compile(data)))
        .fail(rej)
    })
  }
};
