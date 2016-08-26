"use strict";

const PATH_DELIMITER = '/';
const PATH_INDEX = 'index';

module.exports.PATH_DELIMITER = PATH_DELIMITER;

module.exports.toRemotePath = function (url) {
  if (url.length === 0) {
    return PATH_INDEX;
  }
  else {
    return url + (url[url.length - 1] === PATH_DELIMITER ? 'index' : '');
  }
};

module.exports.path = function* (hash) {
  let part, i, lastIndex = 0;
  while((i = hash.indexOf(PATH_DELIMITER, lastIndex)) >= 0) {
    part = hash.slice(0, lastIndex = ++i);
    yield `${part}${PATH_INDEX}`;
  }
  if (lastIndex < hash.length - 1 && hash.slice(lastIndex) !== PATH_INDEX) {
    yield hash;
  }
};

module.exports.arrayPath = function (url) {
  var arr = [];
  for(let next of module.exports.path(url)) {
    arr.push(next);
  }
  return arr;
};

module.exports.compare = function (a, b) {
  for(var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return i;
    }
  }
};
