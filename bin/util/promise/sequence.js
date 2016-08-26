"use strict";
require('./index');

Promise.sequence = function (...sequence) {
  var promise = Promise.resolve();
  for(let next of sequence) {
    promise = promise.then(function () {
      return Promise.isPromise(next) ? next : next(...arguments);
    });
  }
  return promise;
};
