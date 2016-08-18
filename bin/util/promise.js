Promise.hash = function (hash) {
  let keys = Object.keys(hash);

  return Promise.all(keys.map(key => hash[key]))
    .then(function (res) {
      return res.reduce(function (ret, value, i) {
        ret[keys[i]] = value;
        return ret;
      }, {});
    });
};
