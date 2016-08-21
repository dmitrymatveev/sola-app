const iterator = require('./object').Iterator;

// https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
Promise.auto = function (tasks) {

  var sortedList = [];
  var cache = {};

  var task = function (key, value) {
    return cache[key] !== undefined ?
      cache[key] :
      cache[key] = {key, value, lock: false, done: false, dependencies: [], result: null};
  };

  var visit = function (n) {
    if (n.lock) {
      throw new Error(`Tasks contain cyclic dependency: "${n.key}"`);
    }
    if (!n.done) {
      n.lock = true;

      if (Array.isArray(n.value)) {
        let dependencies = n.value.slice(0, n.value.length - 1);
        n.dependencies.push(...dependencies);
        n.value = n.value[n.value.length - 1];
      }

      for(let m of n.dependencies) {
        if (!tasks.hasOwnProperty(m)) {
          throw new Error(`Task "${n.key}" is missing dependency: "${m}"`);
        }
        visit(task(m, tasks[m]));
      }

      n.done = true;
      n.lock = false;
      sortedList.push(n);
    }
  };

  for(let i of iterator(tasks)) {
    let n = task(i.key, i.value);
    visit(n);
  }

  return function () {
    var promise = Promise.resolve();
    for(let next of iterator(sortedList)) {
      promise = promise
        .then(function () {
          return next.dependencies.map(function (key) {
            return cache[key].result;
          });
        })
        .then(function () {
          return next.value.apply(this, arguments);
        })
        .then(function (res) {
          return next.result = res;
        });
    }
    return promise.then(function () {
      return sortedList.map(task => task.result);
    });
  }
};
