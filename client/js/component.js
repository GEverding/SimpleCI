

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("jb55-ap/index.js", function(exports, require, module){
var type = require('type');

module.exports = function(fn){
  if (type(fn) !== 'function') return fn;
  var args = arguments.length > 1? [].slice.call(arguments, 1) : [];
  return fn.apply(this, args);
};


});
require.register("jb55-sort/index.js", function(exports, require, module){
/**
 * Expose `sort`.
 */

exports = module.exports = sort;

/**
 * Sort `el`'s children with the given `fn(a, b)`.
 * Optionally specify `els` to sort instead of `el`'s children
 *
 * @param {Element} el
 * @param {Elements} els
 * @param {Function} fn
 * @api public
 */

function sort(el, els, fn) {
  if (!fn) {
    fn = els;
    els = el.children;
  }
  if (!els) els = el.children;
  var arr = [].slice.call(els).sort(fn);
  var frag = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    frag.appendChild(arr[i]);
  }
  el.appendChild(frag);
};

/**
 * Sort descending.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

exports.desc = function(el, els, fn){
  sort(el, els, function(a, b){
    return ~fn(a, b) + 1;
  });
};

/**
 * Sort ascending.
 */

exports.asc = sort;

});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type = require('type');

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @api public
 */

module.exports = function(obj, fn){
  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj[i], i);
  }
}
});
require.register("component-to-function/index.js", function(exports, require, module){

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18"
  return new Function('_', 'return _.' + str);
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

});
require.register("component-map/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');

/**
 * Map the given `arr` with callback `fn(val, i)`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

module.exports = function(arr, fn){
  var ret = [];
  fn = toFunction(fn);
  for (var i = 0; i < arr.length; ++i) {
    ret.push(fn(arr[i], i));
  }
  return ret;
};
});
require.register("component-event/index.js", function(exports, require, module){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture || false);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture || false);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-indexof/index.js", function(exports, require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});
require.register("component-query/index.js", function(exports, require, module){

function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
};

});
require.register("javve-natural-sort/index.js", function(exports, require, module){
/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */

module.exports = function(a, b, options) {
  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
    sre = /(^[ ]*|[ ]*$)/g,
    dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
    hre = /^0x[0-9a-f]+$/i,
    ore = /^0/,
    options = options || {},
    i = function(s) { return options.insensitive && (''+s).toLowerCase() || ''+s },
    // convert all to strings strip whitespace
    x = i(a).replace(sre, '') || '',
    y = i(b).replace(sre, '') || '',
    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // numeric, hex or date detection
    xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
    yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
    oFxNcL, oFyNcL,
    mult = options.desc ? -1 : 1;
  // first try and sort Hex codes or Dates
  if (yD)
    if ( xD < yD ) return -1 * mult;
    else if ( xD > yD ) return 1 * mult;
  // natural sorting through split numeric strings and default strings
  for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) return -1 * mult;
    if (oFxNcL > oFyNcL) return 1 * mult;
  }
  return 0;
};

/*
var defaultSort = getSortFunction();

module.exports = function(a, b, options) {
  if (arguments.length == 1) {
    options = a;
    return getSortFunction(options);
  } else {
    return defaultSort(a,b);
  }
}
*/
});
require.register("jb55-tablesort/index.js", function(exports, require, module){

var sort = require('sort');
var query = require('query');
var events = require('event');
var each = require('each');
var map = require('map');
var natural = require('natural-sort');
var Emitter = require('emitter');
var inherit = require('inherit');
var ap = require('ap');

module.exports = TableSorter;

/**
 * TableSorter
 *
 * @param {Element} table
 * @param {Object} options
 * @api public
 */
function TableSorter(table, options) {
  if (!(this instanceof TableSorter)) return new TableSorter(table, options);
  var self = this;
  Emitter.call(this);
  options = options || {};
  var defaultSort = function(h, i){
    return function(a, b) {
      a = a.children[i];
      b = b.children[i];
      return natural(a.textContent, b.textContent);
    };
  };
  options.sort = options.sort || defaultSort;
  TableSorter.defaultSort = defaultSort;
  this.defaultSort = defaultSort;
  this.options = options;
  this.table = table;
  this.order = 'none';
  this.attach(table, options);
}

inherit(TableSorter, Emitter);


/**
 * Get headers
 *
 * @param {Function} fn
 * @api public
 */
TableSorter.prototype.headers = function(table){
  if (this._headers) return this._headers;
  var hs = this._headers = this.options.headers || query.all('tr > th', table);
  return hs;
};

/**
 * Get parent element for sorting
 *
 * @param {Element} optional table element
 * @api public
 */
TableSorter.prototype.el = function(table) {
  if (this._el) return this._el;
  table = table || this.table;
  this._el = this.options.el || query('tbody', table);
  return this._el;
};

/**
 * Get elements for sorting
 *
 * @param {Element} optional table element
 * @api public
 */
TableSorter.prototype.elements = function() {
  return ap(this.options.elements) || this.el().children;
};

/**
 * Attach handlers to a table
 *
 * @param {Element} table element
 * @param {Object} options
 * @api public
 */
TableSorter.prototype.attach = function(table){
  this.handlers(this.headers(table));
};


/**
 * Set up event handlers on header elements
 *
 * @param {[Element]} header elements
 * @param {Object} options
 * @api public
 */
TableSorter.prototype.handlers = function(headers, options){
  var self = this;
  each(headers, function(h, i){
    events.bind(h, 'click', function(e){
      var srt = self.options.sort(h, i);
      self.sort(srt, this.order, h, i);
    });
  });
};


/**
 * Sort rows
 *
 * @param {Function} element sorting function
 * @param {String} order {asc,desc}
 * @param {Element} optional related header element for sort event
 * @param {Number} optional related header index for sort event
 * @api public
 */
TableSorter.prototype.sort = function(fn, order, h, i) {
  var el = this.el();
  var els = this.elements();
  this.order = order = order || this.order === 'asc'? 'desc' : 'asc';
  sort[order](el, els, fn);
  this.emit('sort', order, h, i, fn);
};


});
require.register("component-relative-date/index.js", function(exports, require, module){

/**
 * Expose `relative`.
 */

module.exports = relative;

/**
 * Constants.
 */

var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;
var week = 7 * day;
var year = day * 365;
var month = year / 12;

/**
 * Return `date` in words relative to `other`
 * which defaults to now.
 *
 * @param {Date} date
 * @param {Date} other
 * @return {String}
 * @api public
 */

function relative(date, other) {
  other = other || new Date;
  var ms = Math.abs(other - date);

  if (ms < second) return '';

  if (ms == second) return 'one second';
  if (ms < minute) return Math.ceil(ms / second) + ' seconds';

  if (ms == minute) return 'one minute';
  if (ms < hour) return Math.ceil(ms / minute) + ' minutes';

  if (ms == hour) return 'one hour';
  if (ms < day) return Math.ceil(ms / hour) + ' hours';

  if (ms == day) return 'one day';
  if (ms < week) return Math.ceil(ms / day) + ' days';

  if (ms == week) return 'one week';
  if (ms < month) return Math.ceil(ms / week) + ' weeks';

  if (ms == month) return 'one month';
  if (ms < year) return Math.ceil(ms / month) + ' months';

  if (ms == year) return 'one year';
  return Math.round(ms / year) + ' years';
}

});
require.register("bquery-collection/index.js", function(exports, require, module){

var ap = require('ap');

module.exports = function (o) {
  o = o || {};
  o.view = o.view || o.createView;
  return function (v) {
    function container(view) {
      var tag = ap.call(view, o.tag);
      return ap.call(view, o.container) || tag? view.$(tag) : view.$el;
    }

    function insert(subview, $container) {
      if (o.append)
        $container.append(subview);
      else
        $container.prepend(subview);
    }

    function one(collection, $container, model, view) {
      var subview = o.view.call(view, model);
      subview.render();
      insert(subview.el, $container);
      view.trigger("add:collection:view", collection, subview, model);
    }

    function all(cs, view) {
      var $container = container(view);

      var frag = document.createDocumentFragment();
      cs.each(function(m){
        var v = o.view.call(view, m);
        v.render();
        frag.appendChild(v.el);
      });

      insert(frag, $container);
      view.trigger("rendered:collection", cs);
    }

    v.init(function (opts) {
      opts = opts || {};
      var self = this;
      var a = ap.bind(this);
      var collection = a(o.collection) || this.collection;

      var prerender = collection.length > 0;
      this.on('render', function(){
        if (prerender) all(collection, self);
      });

      collection.on('add', function(m){
        one(collection, container(self), m, self);
      });

      collection.on('reset', function(){
        all(collection, self);
      });

      collection.on('sort', function(m){
        all(collection, self);
      });

    });
  };
};

});
require.register("app/index.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var ex;

ex = module.exports;

ex.app = require('./app');

});
require.register("app/app.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var App, dashboard, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

dashboard = require('dashboard');

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.routes = {
    "": "dashboard",
    "dashboard": "dashboard"
  };

  App.prototype.initialize = function(opts) {
    if (opts == null) {
      opts = {};
    }
    this.currentView = {};
    return this.views = {};
  };

  App.prototype.activateTab = function($tab) {
    console.log($tab);
    $tab.addClass("pure-menu-selected");
    return $tab.siblings().removeClass("pure-menu-selected");
  };

  App.prototype.changeView = function(newview) {
    if (this.currentview != null) {
      this.currentview.hide();
    }
    newview.show();
    return this.currentview = newview;
  };

  App.prototype.page = function(opts) {
    var collection, config, view,
      _this = this;
    console.log(opts);
    if (opts != null) {
      config = {
        app: this
      };
      this.activateTab($(opts.tag));
      if (opts.collection != null) {
        config.collection = collection = opts.collection();
        collection.fetch({
          success: function() {
            return collection.trigger('fetched');
          }
        });
      }
      view = this.views[opts.name] = opts.view(config);
      return view.on('navigate', function(place, opt) {
        return _this.navigate(place, opt);
      });
    }
  };

  App.prototype.pages = {
    dashboard: {
      tag: '#dashboardBtn',
      name: 'dashboard',
      collection: function(opts) {
        return new dashboard.collection(null, opts);
      },
      view: function(opts) {
        var DashboardView, view, _ref1;
        DashboardView = dashboard.views.dashboard(opts);
        console.log(DashboardView);
        opts.el = (_ref1 = opts.el) != null ? _ref1 : '#dashboard';
        view = new DashboardView(opts);
        view.render();
        return view;
      }
    }
  };

  App.prototype.dashboard = function() {
    return this.go('dashboard');
  };

  App.prototype.go = function(view) {
    return this.page(this.pages[view]);
  };

  return App;

})(Backbone.Router);

module.exports = App;

});
require.register("monstercat-jade-runtime/index.js", function(exports, require, module){
var exports = module.exports
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

});
require.register("component-querystring/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var trim = require('trim');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    obj[parts[0]] = null == parts[1]
      ? ''
      : decodeURIComponent(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];
  for (var key in obj) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return pairs.join('&');
};

});
require.register("dashboard/templates.js", function(exports, require, module){
var e = module.exports;
e['dashboard'] = require('./templates/dashboard.js');

});
require.register("dashboard/lib/index.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var ex, view, views, _i, _len;

ex = module.exports;

views = ["dashboard"];

ex.views = {};

for (_i = 0, _len = views.length; _i < _len; _i++) {
  view = views[_i];
  ex.views[view] = require("./views/" + view);
}

ex.collection = require('./collection');

ex.model = require('./model');

});
require.register("dashboard/lib/model.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var Dashboard, querystring, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

querystring = require('querystring');

Dashboard = (function(_super) {
  __extends(Dashboard, _super);

  function Dashboard() {
    _ref = Dashboard.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Dashboard.prototype.idAttribute = "_id";

  Dashboard.prototype.urlRoot = '/dashboard';

  Dashboard.prototype.initialize = function(props) {
    if (props == null) {
      props = {};
    }
  };

  return Dashboard;

})(Backbone.Model);

module.exports = Dashboard;

});
require.register("dashboard/lib/collection.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var Dashboard, DashboardCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Dashboard = require('./model');

DashboardCollection = (function(_super) {
  __extends(DashboardCollection, _super);

  function DashboardCollection() {
    _ref = DashboardCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DashboardCollection.prototype.model = Dashboard;

  DashboardCollection.prototype.initialize = function(opts) {
    if (opts == null) {
      opts = {};
    }
  };

  DashboardCollection.prototype.url = '/dashboard';

  return DashboardCollection;

})(Backbone.Collection);

module.exports = DashboardCollection;

});
require.register("dashboard/lib/views/dashboard.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
var collection, mkDashboardView, render;

collection = require('collection');

render = require('render');

mkDashboardView = function(config) {
  var v;
  if (config == null) {
    config = {};
  }
  v = bQuery.view();
  v.init(function(opts) {
    if (opts == null) {
      opts = {};
    }
    return console.log('dashboard opts: ', opts);
  });
  v.use(render({
    template: require('../../templates').dashboard,
    model: function() {
      return {
        build: 'hi'
      };
    },
    raw: true
  }));
  return v.make();
};

module.exports = mkDashboardView;

});
require.register("dashboard/templates/dashboard.js", function(exports, require, module){
var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="header"><h3>Dashboard</h3></div><table id="builds" class="pure-table pure-table-horizontal pure-table-stripted pure-u-1"><thead class="pure-u-1"><tr class="pure-u-1"><th class="pure-u-1-12">#</th><th class="pure-u-1-6">Project</th><th class="pure-u-1-12">Commit</th><th class="pure-u-1-8">Author</th><th class="pure-u-1-6">Started At</th><th class="pure-u-1-6">Completed At</th><th class="pure-u-1-12">Status</th></tr></thead><tbody></tbody></table>');
}
return buf.join("");
};

});
require.register("render/index.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.3
(function() {
  var ap;

  ap = require('ap');

  module.exports = function(opts) {
    var template;
    template = opts.template;
    return function(v) {
      return v.set('render', function(cb) {
        var d, go, model,
          _this = this;
        ap = ap.bind(this);
        go = function(html) {
          _this.$el.html(html);
          return typeof cb === "function" ? cb(_this) : void 0;
        };
        d = {};
        if (opts != null ? opts.model : void 0) {
          model = ap(opts.model);
        } else {
          model = this.model;
        }
        if (ap(opts.raw) != null) {
          d.model = model;
        } else {
          d.model = model.toJSON();
        }
        if (ap(opts.extra)) {
          _(d).extend(ap(opts.extra));
        }
        if (ap(opts.async)) {
          return template(d, go);
        } else {
          return go(ap(template(d)));
        }
      });
    };
  };

}).call(this);

/*
//@ sourceMappingURL=index.map
*/

});
require.alias("jb55-ap/index.js", "SimpleCI/deps/ap/index.js");
require.alias("jb55-ap/index.js", "ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("jb55-tablesort/index.js", "SimpleCI/deps/tablesort/index.js");
require.alias("jb55-tablesort/index.js", "tablesort/index.js");
require.alias("jb55-sort/index.js", "jb55-tablesort/deps/sort/index.js");

require.alias("jb55-ap/index.js", "jb55-tablesort/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("component-each/index.js", "jb55-tablesort/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-map/index.js", "jb55-tablesort/deps/map/index.js");
require.alias("component-to-function/index.js", "component-map/deps/to-function/index.js");

require.alias("component-event/index.js", "jb55-tablesort/deps/event/index.js");

require.alias("component-emitter/index.js", "jb55-tablesort/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-inherit/index.js", "jb55-tablesort/deps/inherit/index.js");

require.alias("component-query/index.js", "jb55-tablesort/deps/query/index.js");

require.alias("javve-natural-sort/index.js", "jb55-tablesort/deps/natural-sort/index.js");

require.alias("component-relative-date/index.js", "SimpleCI/deps/relative-date/index.js");
require.alias("component-relative-date/index.js", "relative-date/index.js");

require.alias("bquery-collection/index.js", "SimpleCI/deps/collection/index.js");
require.alias("bquery-collection/index.js", "collection/index.js");
require.alias("jb55-ap/index.js", "bquery-collection/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("app/index.js", "SimpleCI/deps/app/index.js");
require.alias("app/app.js", "SimpleCI/deps/app/app.js");
require.alias("app/index.js", "SimpleCI/deps/app/index.js");
require.alias("app/index.js", "app/index.js");
require.alias("dashboard/templates.js", "app/deps/dashboard/templates.js");
require.alias("dashboard/lib/index.js", "app/deps/dashboard/lib/index.js");
require.alias("dashboard/lib/model.js", "app/deps/dashboard/lib/model.js");
require.alias("dashboard/lib/collection.js", "app/deps/dashboard/lib/collection.js");
require.alias("dashboard/lib/views/dashboard.js", "app/deps/dashboard/lib/views/dashboard.js");
require.alias("dashboard/templates/dashboard.js", "app/deps/dashboard/templates/dashboard.js");
require.alias("dashboard/lib/index.js", "app/deps/dashboard/index.js");
require.alias("jb55-tablesort/index.js", "dashboard/deps/tablesort/index.js");
require.alias("jb55-sort/index.js", "jb55-tablesort/deps/sort/index.js");

require.alias("jb55-ap/index.js", "jb55-tablesort/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("component-each/index.js", "jb55-tablesort/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-map/index.js", "jb55-tablesort/deps/map/index.js");
require.alias("component-to-function/index.js", "component-map/deps/to-function/index.js");

require.alias("component-event/index.js", "jb55-tablesort/deps/event/index.js");

require.alias("component-emitter/index.js", "jb55-tablesort/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-inherit/index.js", "jb55-tablesort/deps/inherit/index.js");

require.alias("component-query/index.js", "jb55-tablesort/deps/query/index.js");

require.alias("javve-natural-sort/index.js", "jb55-tablesort/deps/natural-sort/index.js");

require.alias("monstercat-jade-runtime/index.js", "dashboard/deps/jade-runtime/index.js");

require.alias("component-querystring/index.js", "dashboard/deps/querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("bquery-collection/index.js", "dashboard/deps/collection/index.js");
require.alias("jb55-ap/index.js", "bquery-collection/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("render/index.js", "dashboard/deps/render/index.js");
require.alias("render/index.js", "dashboard/deps/render/index.js");
require.alias("jb55-ap/index.js", "render/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("render/index.js", "render/index.js");

require.alias("dashboard/lib/index.js", "dashboard/index.js");

require.alias("app/index.js", "app/index.js");

require.alias("dashboard/templates.js", "SimpleCI/deps/dashboard/templates.js");
require.alias("dashboard/lib/index.js", "SimpleCI/deps/dashboard/lib/index.js");
require.alias("dashboard/lib/model.js", "SimpleCI/deps/dashboard/lib/model.js");
require.alias("dashboard/lib/collection.js", "SimpleCI/deps/dashboard/lib/collection.js");
require.alias("dashboard/lib/views/dashboard.js", "SimpleCI/deps/dashboard/lib/views/dashboard.js");
require.alias("dashboard/templates/dashboard.js", "SimpleCI/deps/dashboard/templates/dashboard.js");
require.alias("dashboard/lib/index.js", "SimpleCI/deps/dashboard/index.js");
require.alias("dashboard/lib/index.js", "dashboard/index.js");
require.alias("jb55-tablesort/index.js", "dashboard/deps/tablesort/index.js");
require.alias("jb55-sort/index.js", "jb55-tablesort/deps/sort/index.js");

require.alias("jb55-ap/index.js", "jb55-tablesort/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("component-each/index.js", "jb55-tablesort/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-map/index.js", "jb55-tablesort/deps/map/index.js");
require.alias("component-to-function/index.js", "component-map/deps/to-function/index.js");

require.alias("component-event/index.js", "jb55-tablesort/deps/event/index.js");

require.alias("component-emitter/index.js", "jb55-tablesort/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-inherit/index.js", "jb55-tablesort/deps/inherit/index.js");

require.alias("component-query/index.js", "jb55-tablesort/deps/query/index.js");

require.alias("javve-natural-sort/index.js", "jb55-tablesort/deps/natural-sort/index.js");

require.alias("monstercat-jade-runtime/index.js", "dashboard/deps/jade-runtime/index.js");

require.alias("component-querystring/index.js", "dashboard/deps/querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("bquery-collection/index.js", "dashboard/deps/collection/index.js");
require.alias("jb55-ap/index.js", "bquery-collection/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("render/index.js", "dashboard/deps/render/index.js");
require.alias("render/index.js", "dashboard/deps/render/index.js");
require.alias("jb55-ap/index.js", "render/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("render/index.js", "render/index.js");

require.alias("dashboard/lib/index.js", "dashboard/index.js");

require.alias("render/index.js", "SimpleCI/deps/render/index.js");
require.alias("render/index.js", "SimpleCI/deps/render/index.js");
require.alias("render/index.js", "render/index.js");
require.alias("jb55-ap/index.js", "render/deps/ap/index.js");
require.alias("component-type/index.js", "jb55-ap/deps/type/index.js");

require.alias("render/index.js", "render/index.js");

