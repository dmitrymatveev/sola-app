const store = require('./InternalModulesCache');
const hashCode = require('../util/string').hashCode;
const hashbang = require('../util/hashbang');

const Controller = require('./Controller');
const Template = require('./Template');

const PRIVATE = new WeakMap();

class Route {
  constructor(url, delegate) {
    console.log('Route: ' + url);

    PRIVATE.set(this, {
      id: Route.getTemplateId(url),
      url,
      path: new hashbang.arrayPath(url),
      controller: null,
      template: null
    });

    if (delegate) {
      delegate.call(this);
    }

    store.instance().routes.set(url, this);
  }

  get url() { return PRIVATE.get(this).url }
  get path() { return PRIVATE.get(this).path }
  get id() { return PRIVATE.get(this).id }

  static lookupRouteByUrl(url) {
    let id = hashbang.toRemotePath(url);
    return store.instance().lookup(store.MODULE_TYPE.route, id, `routes/${id}`);
  }

  static getTemplateId(url) {
    return '#sla_' + hashCode(url);
  }

  getParentRenderDestination() {
    let path = this.path;

    if (path.length === 0) {
      return Promise.resolve('body');
    }
    else if (path.length > 1) {
      let parentUrl = path[path.length - 1];
      return Route.lookupRouteByUrl(parentUrl).then(route => route.id);
    }
    else {
      return Promise.resolve(Route.getTemplateId('index'));
    }
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
      return res.template.hbs(res.controller);
    });
  }
}

module.exports = Route;
