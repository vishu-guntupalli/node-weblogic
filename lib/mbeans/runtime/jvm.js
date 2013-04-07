var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var JVMRuntime = function(proxy) {
  this._attributeFunctions = [ 'HeapFreeCurrent', 'HeapFreePercent', 'HeapSizeCurrent', 'HeapSizeMax',
    'JavaVendor', 'JavaVersion', 'JavaVMVendor', 'MBeanInfo', 'Name', 'ObjectName', 'OSName', 'OSVersion',
    'Parent', 'ThreadStackDump', 'Type', 'Uptime'
  ];
  this._skipAttributes = [ 'Parent', 'ThreadStackDump' ];
  SuperMbean.call(this, proxy);
}


util.inherits(JVMRuntime, SuperMbean);

module.exports = JVMRuntime;
