const Route = require('./Route');

class Router {

  transition(routePath) {
    return Route.lookupRouteInstance(routePath)
      .then(route => route.render())
      .then(html => {
        $('body').html(html);
      });
  }
}

module.exports = Router;
