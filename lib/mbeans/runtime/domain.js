var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var DomainRuntime = function(proxy) {
  this._attributeFunctions = [ 'ActivationTime', 'MBeanInfo', 'Name', 'ObjectName', 'Parent', 'Registered', 'Type' ];
  SuperMbean.call(this, proxy);
}

util.inherits(DomainRuntime, SuperMbean);

// Child MBeans
DomainRuntime.prototype.lookupServerLifeCycleRuntime = function(server, next) {
  this.proxy.lookupServerLifeCycleRuntime(server, next);
}

module.exports = DomainRuntime;

