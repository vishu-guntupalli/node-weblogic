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
JDBCServiceRuntime.prototype.getJDBCDataSourceRuntimes = function(next) {
  var proxies = [];
  this.proxy.getJDBCDataSourceRuntimeMBeans(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new JDBCDataSourceRuntime(proxy));
    });
    next(err, proxies);
  });
}


module.exports = JDBCServiceRuntime;

