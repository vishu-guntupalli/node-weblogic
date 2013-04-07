var ce = require('cloneextend');
var HealthState = require(__dirname + '/helpers/health-state');


function SuperMbean(proxy) {
  this.proxy = proxy;
  // Prototype attributes
  this._attributeFunctions = this._attributeFunctions || [];
  this._attributeVars = this._attributeVars || [];
  this._skipAttributes = this._skipAttributes || [ 'Parent' ];
  // Setup method functions
  this._attributeFunctions.forEach(function(attribute) {
    var getter = 'get' + attribute;
    var syncGetter = 'get' + attribute + 'Sync';
    SuperMbean.prototype[getter] = function() {
      try {
        var ret = this.proxy[syncGetter]();
      } catch(e) {
//        console.log('ERROR: ' + e.getMessage());
      }
      var isHealthState = Object.prototype.toString.call(ret).match(/weblogic_health_HealthState/);
      if (isHealthState) {
        return HealthState.getStateAsText(ret);
      }
      return ret; 
    };
  });
  // Setup boolean functions
  this._attributeVars.forEach(function(attribute) {
    var getter = 'get' + attribute;
    var syncGetter = 'is' + attribute + 'Sync';
    SuperMbean.prototype[getter] = function() {
      return this.proxy[syncGetter]();
    };
  });
}

exports.SuperMbean = SuperMbean;

SuperMbean.prototype.getAllAttributes = function() {
  var self = this;
  var ret = {};
  var allAttributes = ce.cloneextend(this._attributeFunctions, this._attributeVars);
  allAttributes.forEach(function(attribute) {
    if (self._skipAttributes.indexOf(attribute) !== -1) {
      return;
    }
    var lcName = attribute.replace(/^[A-Z]*/, function(g) {return g.toLowerCase()});
    var getter = 'get' + attribute;
    ret[lcName] = self[getter]();
  });
  return ret;
}
