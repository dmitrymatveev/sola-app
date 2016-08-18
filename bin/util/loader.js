var $ = require('jquery');

module.exports = {
  loadScript(path) {
    return new Promise(function (resolve, reject) {
      $.getScript(path + '.js')
        .done(() => {resolve()})
        .fail(reject);
    })
  },

  loadTemplate(path) {
    return new Promise(function (resolve, reject) {
      $.get(path + '.hbs')
        .done(data => { resolve(data) })
        .fail(reject);
    })
  }
};
