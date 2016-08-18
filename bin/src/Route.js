const store = require('./InternalModulesCache');
const loader = require('../util/loader');

const Controller = require('./Controller');
const Template = require('./Template');

const PRIVATE = new WeakMap();

class Route {
  constructor(url, delegate) {
    console.log('Route: ' + url);

    PRIVATE.set(this, {
      url,
      controller: null,
      template: null
    });

    if (delegate) {
      delegate.call(this);
    }

    store.instance().routes.set(url, this);
  }

  get url() {
    return PRIVATE.get(this).url;
  }

  static lookupRouteInstance(url) {
    let path = `routes/${url}`;
    return store.instance().lookup(store.MODULE_TYPE.route, url, path);
  }

  getController() {

    let p = PRIVATE.get(this);
    if (p.controller !== null) {
      return Promise.resolve(p.controller);
    }
    else {
      return Controller.lookupControllerInstance(this.url)
        .then(controller => {
          return p.controller = controller;
        })
        .catch(err => {
          if (err.status === 404) {
            return p.controller = new Controller(this.url);
          }
          else {
            return Promise.reject(err);
          }
        });
    }
  }

  getTemplate() {

    let p = PRIVATE.get(this);
    if (p.template !== null) {
      return Promise.resolve(p.template);
    }
    else {
      return Template.lookupTemplateInstance(this.url)
        .then(template => {
          return p.template = template;
        })
        .catch(err => {
          if (err.status === 404) {
            return p.template = new Template(this.url, '<div></div>');
          }
          else {
            return Promise.reject(err);
          }
        });
    }
  }

  render() {
    return Promise.hash({
      controller: this.getController(),
      template: this.getTemplate()
    }).then(res => {
      return res.template.hbs(res.controller.ctx);
    });
  }
}

module.exports = Route;
