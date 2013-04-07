var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var JDBCDriverParams = require(__dirname + '/jdbc-driver-params');

var JDBCDataSource = function(proxy) {
  this._attributeFunctions = [ 'Name' ];
  SuperMbean.call(this, proxy);
}

util.inherits(JDBCDataSource, SuperMbean);

// Child MBeans
JDBCDataSource.prototype.getJDBCDriverParams = function() {
  return new JDBCDriverParams(this.proxy.getJDBCDriverParamsSync());
}

module.exports = JDBCDataSource;

