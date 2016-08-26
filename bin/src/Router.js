const Route = require('./Route');
const hashbang = require('../util/hashbang');

const REGEX_URL_HASH = /#?((?:(\w+)[\.\/]?)+)\??/;
const REGEX_HASH_DELIMITER = /[\.\/]/;

const PRIVATE = new WeakMap();

class Router {

  constructor() {
    PRIVATE.set(this, {
      activeRoute: null,
    });
  }

  static parseHashAsPathList(hash) {
    var match = REGEX_URL_HASH.exec(hash);
    console.log(match);
    return (match === null) ? ['index'] : match[1].split(REGEX_HASH_DELIMITER);
  }

  transition(routePath) {
    var p = PRIVATE.get(this);
    var targetUrl = Router.parseHashAsPathList(routePath);

    Promise.auto({

      target: Route.lookupRouteByUrl(routePath),

      tasks: ['target', function (res) {
        var idx = -1;
        if (p.activeRoute !== null) {
          idx = hashbang.compare(p.activeRoute.path, res.target.path);
          return {
            index: idx,
            tearDown: p.activeRoute.path.slice(idx),
            setUp: res.target.path.slice(idx)
          }
        }
        else {
          return {
            index: idx,
            tearDown: [],
            setUp: ['index'].concat(res.target.path.slice(0))
          }
        }
      }],

      setUp: ['tasks', 'target', function (res) {

        var renderTask = function (next) {

          return Promise.sequence(
            Route.lookupRouteByUrl(next),
            route => {
              return Promise.hash({
                id: route.getParentRenderDestination(),
                template: route.render()
              });
            },
            res => {
              $(res.id).html(res.template);
            }
          );

        };

        return Promise.each(res.tasks.setUp, renderTask).then(function () {
          return res;
        })
      }],

      tearDown: ['setUp', function () {

      }]
    });
  }
}

module.exports = Router;
