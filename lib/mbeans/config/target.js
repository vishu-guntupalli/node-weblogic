var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var Target = function(proxy) {
  this._attributeFunctions = [ 'MBeanInfo', 'Name', 'Notes', 'ObjectName', 'Parent', 'Type' ];
  SuperMbean.call(this, proxy);
}

util.inherits(Target, SuperMbean);

module.exports = Target;

