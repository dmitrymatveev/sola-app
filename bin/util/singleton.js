"use strict";

/**
 * @template T
 */
class SingletonObjectReference {
  constructor(name, factoryMethod) {
    this.name = name;
    this.factory = factoryMethod || (() => {});

    var SYMBOL = Symbol.for(name);
    if (Object.getOwnPropertySymbols(window).indexOf(SYMBOL) < 0) {
      window[SYMBOL] = {
        instance: null
      }
    }
  }

  /**
   * @returns {{T}}
   */
  instance() {
    var symbol = window[Symbol.for(this.name)];
    if (symbol.instance === null) {
      symbol.instance = this.factory();
    }
    return symbol.instance;
  }
}

module.exports = {

  SingletonObjectReference,

  setClassSingleton(Type) {
    var KLASS_SYMBOL = Symbol.for(Type.name);
    if (Object.getOwnPropertySymbols(window).indexOf(KLASS_SYMBOL) < 0) {
      window[KLASS_SYMBOL] = {
        instance: null,
        _lock: true
      }
    }
  },

  lookupInstance(Type) {
    let ref = window[Symbol.for(Type.name)];

    if (ref.instance === null) {
      ref._lock = false;
      ref.instance = new Type();
      ref._lock = true;
    }

    return ref.instance;
  },

  ensureSingletonConstructor(Type) {
    let ref = window[Symbol.for(Type.name)];
    if (ref._lock) {
      throw new Error(`Constructor of the singleton type '${Type.name}' may not be called directly`);
    }
  },

  /**
   *
   * @param name
   * @param factoryMethod
   * @returns {*}
   */
  object(name, factoryMethod) {

    var SYMBOL = Symbol.for(name);
    if (Object.getOwnPropertySymbols(window).indexOf(SYMBOL) < 0) {
      window[SYMBOL] = {
        instance: null
      }
    }

    return {
      instance() {
        var symbol = window[Symbol.for(name)];
        if (symbol.instance === null) {
          symbol.instance = factoryMethod ? factoryMethod() : {};
        }
        return symbol.instance;
      }
    }
  }
};
