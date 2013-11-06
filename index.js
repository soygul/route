
/**
 * Module dependencies.
 */

var pathToRegexp = require('path-to-regexp');
var debug = require('debug')('koa-route');
var methods = require('methods');

methods.forEach(function(method){
  exports[method] = create(method);
});

function create(method) {
  method = method.toUpperCase();

  return function(path, fn){
    var re = pathToRegexp(path);
    debug('%s %s -> %s', method, path, re);

    return function(next){
      return function *(){
        var m = re.exec(this.path);
        
        if (m) {
          var args = m.slice(1);
          debug('%s %s matches %s %j', this.method, path, this.path, args);
          yield fn.apply(this, args);
        }

        yield next;
      }
    }
  }
}