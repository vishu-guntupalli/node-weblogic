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
      try {
        this.proxy[syncGetter](function(err, result) {
          if (err) { return next(err); }
          var isHealthState = Object.prototype.toString.call(result).match(/weblogic_health_HealthState/);
          if (isHealthState) {
            return HealthState.getStateAsText(result, next);
          }
          next(err, result);
        });
      } catch(e) {
//        console.log('ERROR: ' + e.getMessage());
      }
    };
  });
  // Setup boolean functions
  this._attributeVars.forEach(function(attribute) {
    var getter = 'get' + attribute;
    var syncGetter = 'is' + attribute;
    SuperMbean.prototype[getter] = function(next) {
      this.proxy[syncGetter](next);
    };
  });
}

exports.SuperMbean = SuperMbean;

SuperMbean.prototype.getAllAttributes = function(next) {
  var self = this;
  var ret = {};
  var allAttributes = ce.cloneextend(this._attributeFunctions, this._attributeVars);

  async.forEach(allAttributes, function(attribute, callback) {
    if (self._skipAttributes.indexOf(attribute) !== -1) {
      return callback();
    }
    var lcName = attribute.replace(/^[A-Z]*/, function(g) {return g.toLowerCase()});
    var getter = 'get' + attribute;
    self[getter](function(err, result) {
      ret[lcName] = result;
      return callback(err);
    });
  }, function(err) {
    next(err, ret);
  });
}
