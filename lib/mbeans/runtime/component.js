var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var WebAppComponentRuntime = require(__dirname + '/web-app-component');

var ComponentRuntime = function(proxy) {
  this._attributeFunctions = [ 'DeploymentState', 'MBeanInfo', 'ModuleId', 'Name', 'ObjectName', 'Parent', 'Type' ];
  this._attributeVars = [ 'CachingDisabled', 'Registered' ];
  SuperMbean.call(this, proxy);
}


util.inherits(ComponentRuntime, SuperMbean);

// Helpers
ComponentRuntime.prototype.getSubtype = function(type) {
  var getter = 'get' + type;
  // if getter function exists call it
  if (this[getter] !== undefined) {
    return this[getter]();
  }
  return undefined;
}

ComponentRuntime.prototype.getWebAppComponentRuntime = function() {
  return new WebAppComponentRuntime(this.proxy);
}


module.exports = ComponentRuntime;

