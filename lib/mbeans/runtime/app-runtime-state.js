var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var AppRuntimeStateRuntime = function(proxy) {
  this._attributeFunctions = [ 'ApplicationIds', 'MBeanInfo', 'Name', 'ObjectName', 'Parent', 'Registered', 'Type',
  ];
  SuperMbean.call(this, proxy);
}

util.inherits(AppRuntimeStateRuntime, SuperMbean);

// Operations
AppRuntimeStateRuntime.prototype.getIntendedState = function(next) {
  this.proxy.getIntendedState(next);
}


module.exports = AppRuntimeStateRuntime;

