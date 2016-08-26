"use strict";

Promise.isPromise = function (v) {
  return v instanceof Promise;
};
