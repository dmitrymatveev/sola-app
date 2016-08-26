"use strict";
require('./index');

Promise.each = function (array, callback) {
  var promise = Promise.resolve();
  for(let next of array) {
    promise = promise.then(function () {
      return callback(next);
    });
  }
  return promise;
};

