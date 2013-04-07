var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var JDBCDriverParams = require(__dirname + '/jdbc-driver-params');

var JDBCDriverParams = function(proxy) {
  this._attributeFunctions = [ 'DriverName', 'Password', 'PasswordEncrypted', 'Url', 'UseXaDataSourceInterface' ];
  SuperMbean.call(this, proxy);
}

util.inherits(JDBCDriverParams, SuperMbean);

module.exports = JDBCDriverParams;

