var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var ComponentRuntime = require(__dirname + '/component');

var ApplicationRuntime = function(proxy) {
  this._attributeFunctions = [ 'ApplicationName', 'ApplicationVersion', 'HealthState',
    'MBeanInfo', 'Name', 'ObjectName', 'Parent', 'Type'
  ];
  SuperMbean.call(this, proxy);
}


util.inherits(ApplicationRuntime, SuperMbean);

// Child MBeans
ApplicationRuntime.prototype.getComponentRuntimes = function(next) {
  var proxies = [];
  this.proxy.getComponentRuntimes(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new ComponentRuntime(proxy));
    });
    next(err, proxies);
  });
}

module.exports = ApplicationRuntime;

