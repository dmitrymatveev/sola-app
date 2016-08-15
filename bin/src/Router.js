var loader = require('../util/loader');

class Router {
  constructor() {
    this.map = new Map();
  }

  add(route) {
    this.map.set(route.url, {
      route,
      controller: {foo: 'boo'},
      template: null
    });
  }

  transition(toRoute) {
    let map = this.map;

    Promise.resolve({
      then(res, rej) {
        let cached = map.get(toRoute);
        if (!cached) {
          loader.loadScript(`routes/${toRoute}.js`)
            .then(function () {
              res(map.get(toRoute));
            })
            .catch(rej);
        }
        else {
          res(cached);
        }
      }
    }).then(function (cached) {
      return cached.template ?
        cached :
        loader.loadTemplate(`templates/${cached.route.url}.hbs`).then(function (hbs) {
          cached.template = hbs;
          return cached;
        });
    }).then(function (cached) {
      $('body').html(cached.template(cached.route.controller));
    })
  }
}

module.exports = Router;
