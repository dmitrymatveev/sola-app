let Application = require('./Application');

const PRIVATE = new WeakMap();

class Route {
  constructor(url, delegate) {
    console.log('Route: ' + url);

    PRIVATE.set(this, {
      url
    });

    if (delegate) {
      delegate.call(this);
    }

    Application.instance().router.add(this);
  }

  get url() { return PRIVATE.get(this).url; }
}

module.exports = Route;
