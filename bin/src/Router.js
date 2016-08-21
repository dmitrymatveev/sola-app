const Route = require('./Route');
const iterator = require('../util/object').Iterator;

const REGEX_URL_HASH = /#?((?:(\w+)[\.\/]?)+)\??/;
const REGEX_HASH_DELIMITER = /[\.\/]/;

const PRIVATE = new WeakMap();
const routerHelpers = {};

class Router {

  constructor() {
    PRIVATE.set(this, {
      activeRoute: null,
    });
  }

  static parseHashAsPathList(hash) {
    var match = REGEX_URL_HASH.exec(hash);
    return (match === null) ? ['index'] : match[1].split(REGEX_HASH_DELIMITER);
  }

  transition(routePath) {
    var p = PRIVATE.get(this);

    // var currentRoute = null;
    // var target = Router.parseHashAsPathList(routePath);
    //
    // var getCurrentRoute = Route.lookupRouteInstance(routePath)
    //   .then(function (route) {
    //     currentRoute = route;
    //
    //     var current = Router.parseHashAsPathList(route.url);
    //
    //     // Find diverged path
    //     var tearDownList = [];
    //     for(let i = 0; i <= target.length; i++) {
    //       if (target[i] !== current[i]) {
    //         var cut = current.slice(i);
    //         tearDownList.push(...cut);
    //         break;
    //       }
    //     }
    //
    //     return tearDownList;
    //   });
    //
    // getCurrentRoute.then(Promise.hash({
    //   makeTearDownList: function () {
    //
    //   }
    // }));




    //
    // if (p.activeRoute !== null) {
    //   p.activeRoute.teardown();
    // }
    //
    // var tearDownActive = p.activeRoute ? p.activeRoute.teardown() : Promise.resolve();

    var url = Router.parseHashAsPathList(routePath)[0];
    return Route.lookupRouteInstance(url)
      .then(route => route.render())
      .then(html => {
        console.log('rendered')
        $('body').html(html);
      });
  }
}

module.exports = Router;
