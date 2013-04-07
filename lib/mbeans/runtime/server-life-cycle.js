var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var ServerLifeCycleRuntime = function(proxy) {
  this._attributeFunctions = [ 'MBeanInfo', 'Name', 'NodeManagerRestartCount', 'ObjectName', 'Parent', 'State', 'Type' ];
  this._skipAttributes = [ 'Parent', 'ThreadStackDump' ];
  SuperMbean.call(this, proxy);
}


util.inherits(ServerLifeCycleRuntime, SuperMbean);

module.exports = ServerLifeCycleRuntime;

