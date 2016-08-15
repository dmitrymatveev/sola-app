/*
 https://gist.github.com/dmitrymatveev/ad5f816d2c1b29fe0e07

 Simple function overloading, well, not exactly overloading.
 Invokes overloaded function with the matching number of arguments passed to its proxy.
 Example:
 let fnc = overloaded(
 function () {console.log('-')},
 function (a) {console.log(a)}
 );

 fnc.overload(function tuple (a, b) {
 console.log(arguments);
 });

 fnc(); // > '-'
 fnc(1); // > 'a'
 fnc('foo', 'boo'); // > ['foo', 'boo']

 let cachedMethod = fnc.get(2);
 cachedMethod.prototype.constructor.name; // > tuple
 */
$.overloaded = function () {

  let map = {};
  map.overrides = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
  map.build = function () {
    map.length = 0;
    map.overrides.reduce(function (last, next) {
      if (last[next.length] !== undefined) {
        throw new Error('Duplicate function overload');
      }
      last[next.length] = next;
      last.length++;
      return last;
    }, map.values = {});
    return map;
  };

  let apply = function (args) {
    let fnc = map.values[args.length];
    if (fnc === undefined) throw new ReferenceError('Overloaded function is not defined');
    else return fnc.apply(this, args);
  };

  let build = function (args) {
    map.build();
    call = apply;
    return apply(args);
  };

  let proxy = function () {
    return call(arguments)
  };

  proxy.overload = function (method) {
    map.overrides.push(method);
    call = build;
    return proxy;
  };

  proxy.get = function (signatureLength) {
    return map.length ? map.values[signatureLength] : map.build().values[signatureLength];
  };

  let call = build;
  return proxy;
};
