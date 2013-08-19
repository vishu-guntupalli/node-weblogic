var ce = require('cloneextend');
var HealthState = require(__dirname + '/helpers/health-state');
var async = require('async');


function SuperMbean(proxy) {
  this.proxy = proxy;
  // Prototype attributes
  this._attributeFunctions = this._attributeFunctions || [];
  this._attributeVars = this._attributeVars || [];
  this._skipAttributes = this._skipAttributes || [ 'Parent' ];
  // Setup method functions
  this._attributeFunctions.forEach(function(attribute) {
    var getter = 'get' + attribute;
    var syncGetter = 'get' + attribute;
    SuperMbean.prototype[getter] = function(next) {
      this.proxy[syncGetter](function(err, result) {
        if (err) { return next(); }
        var isHealthState = Object.prototype.toString.call(result).match(/weblogic_health_HealthState/);
        if (isHealthState) {
          return HealthState.getStateAsText(result, next);
        }
        next(undefined, result);
      });
    };
  });
  // Setup boolean functions
  this._attributeVars.forEach(function(attribute) {
    var getter = 'get' + attribute;
    var syncGetter = 'is' + attribute;
    SuperMbean.prototype[getter] = function(next) {
      this.proxy[syncGetter](function(err, result) {
        next(undefined, result);
      });
    };
  });
}

exports.SuperMbean = SuperMbean;

SuperMbean.prototype.getAllAttributes = function(next) {
  var self = this;
  var ret = {};
  var allAttributes = ce.clone(this._attributeFunctions);
  allAttributes.push.apply(allAttributes, this._attributeVars);

  async.eachSeries(allAttributes, function(attribute, callback) {
    if (self._skipAttributes.indexOf(attribute) !== -1) {
      return callback();
    }
    var lcName = attribute.replace(/^[A-Z]*/, function(g) {return g.toLowerCase()});
    var getter = 'get' + attribute;
    self[getter](function(err, result) {
      if (err) { return callback(); }
      ret[lcName] = result;
      callback();
    });
  }, function(err) {
    next(undefined, ret);
  });
}
