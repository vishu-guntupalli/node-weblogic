var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var JDBCDataSourceRuntime = require(__dirname + '/jdbc-datasource');

var JDBCServiceRuntime = function(proxy) {
  this._attributes = [ 'HealthState', 'MBeanInfo', 'Name', 'ObjectName', 'Parent', 'Type' ];
  this._skipAttributes = [ 'Parent' ];
  SuperMbean.call(this, proxy);
}

util.inherits(JDBCServiceRuntime, SuperMbean);

// Child MBeans
JDBCServiceRuntime.prototype.getJDBCDataSourceRuntimes = function() {
  var proxies = [];
  this.proxy.getJDBCDataSourceRuntimeMBeansSync().forEach(function(proxy) {
    proxies.push(new JDBCDataSourceRuntime(proxy));
  });
  return proxies;
}


module.exports = JDBCServiceRuntime;

