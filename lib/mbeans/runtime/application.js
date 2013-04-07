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
ApplicationRuntime.prototype.getComponentRuntimes = function() {
  var proxies = [];
  this.proxy.getComponentRuntimesSync().forEach(function(proxy) {
    proxies.push(new ComponentRuntime(proxy));
  });
  return proxies;
}

module.exports = ApplicationRuntime;

