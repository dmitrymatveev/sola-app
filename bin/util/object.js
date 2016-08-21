"use strict";

/**
 * @param target
 * @param src
 * @param use
 * @returns {boolean|Array|{}}
 */
module.exports.deepCopy = function deepMerge(target, src, use) {
  var array = Array.isArray(src);
  var dst = use ? use : array && [] || {};

  if (array) {
    target = target || [];
    dst = dst.concat(target);
    src.forEach(function(e, i) {
      if (typeof dst[i] === 'undefined') {
        dst[i] = e;
      } else if (typeof e === 'object') {
        dst[i] = deepMerge(target[i], e);
      } else {
        if (target.indexOf(e) === -1) {
          dst.push(e);
        }
      }
    });
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function (key) {
        dst[key] = target[key];
      })
    }
    Object.keys(src).forEach(function (key) {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      }
      else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = deepMerge(target[key], src[key]);
        }
      }
    });
  }

  return dst;
};

var iteratorAccessor = {
  object(key, obj) { return {key, value: obj[key]} },
  array(key, array) { return array[key] }
};

module.exports.Iterator = function (obj) {
  var iterable = {};
  var value = Array.isArray(obj) ? iteratorAccessor.array : iteratorAccessor.object;
  iterable[Symbol.iterator] = function () {
    var keys = Object.keys(obj);
    var i = -1;
    return {
      hasNext() { return i + 1 >= keys.length },
      next() {
        if (++i >= keys.length) return {done: true};
        else return {
          value: value(keys[i], obj), done: false
        };
      }
    }
  };
  return iterable;
};

module.exports.TransformIterator = function (obj) {
  var iterable = {};
  iterable[Symbol.iterator] = function () {
    var keys = Object.keys(obj);
    var i = -1;
    return {
      hasNext() { return i + 1 >= keys.length },
      next() {
        if (++i >= keys.length) return {done: true};
        else return {
          done: false,
          value: {
            key: keys[i],
            getValue() {
              return obj[keys[i]];
            },
            setValue(v) {
              obj[keys[i]] = v;
            }
          }
        };
      }
    }
  };
  return iterable;
};

module.exports.findMember = function findMember(obj, ref) {

  let addr = Array.isArray(ref) ? ref : ref.split('.');
  let key = addr.shift();

  if (!key) return undefined;

  let next = obj[key];

  if (addr.length <= 0) {
    return next;
  }
  if (typeof next === 'object') {
    return findMember(next, addr);
  }
  else {
    return undefined;
  }
};

// Hides try-catch which would otherwise cause V8 to not optimize any function that has it.
module.exports.safeParse = function (str, callback) {
  var res = undefined;
  if (typeof str !== 'string') {
    callback(new Error(`safeParse expected string, was: "${typeof str}"`));
  }
  else {
    try {
      res = JSON.parse(str);
    }
    catch (e) {
      callback(e);
    }
    callback(null, res);
  }
};
