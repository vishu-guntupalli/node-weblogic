var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var JVMRuntime = require(__dirname + '/jvm');
var ThreadPoolRuntime = require(__dirname + '/threadpool');
var JDBCServiceRuntime = require(__dirname + '/jdbc-service');
var ApplicationRuntime = require(__dirname + '/application');

var ServerRuntime = function(proxy) {
  this._attributeFunctions = [ 'ActivationTime', 'AdministrationPort', 'AdministrationURL',
    'AdminServerHost', 'AdminServerListenPort', 'CurrentDirectory', 'CurrentMachine',
    'DefaultURL', 'HealthState', 'ListenAddress', 'ListenPort', 'MBeanInfo', 'Name', 'ObjectName', 'OpenSocketsCurrentCount',
    'Parent', 'RestartsTotalCount', 'ServerClasspath', 'SocketsOpenedTotalCount', 'SSLListenAddress',
    'SSLListenPort', 'State', 'StateVal', 'Type', 'WeblogicVersion' 
  ];
  this._attributeVars = [ 'AdministrationPortEnabled', 'AdminServer', 'AdminServerListenPortSecure',
    'ListenPortEnabled', 'RestartRequired', 'SSLListenPortEnabled'
  ];
  SuperMbean.call(this, proxy);
}

util.inherits(ServerRuntime, SuperMbean);

// Child MBeans
ServerRuntime.prototype.getJVMRuntime = function(next) {
  this.proxy.getJVMRuntime(function(err, result) {
    next(err, new JVMRuntime(result));
  });
}

ServerRuntime.prototype.getThreadPoolRuntime = function(next) {
  this.proxy.getThreadPoolRuntime(function(err, result) {
    next(err, new ThreadPoolRuntime(result));
  });
}

ServerRuntime.prototype.getJDBCServiceRuntime = function(next) {
  this.proxy.getJDBCServiceRuntime(function(err, result) {
    next(err, new JDBCServiceRuntime(result));
  });
}

ServerRuntime.prototype.getApplicationRuntimes = function(next) {
  var proxies = [];
  this.proxy.getApplicationRuntimes(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new ApplicationRuntime(proxy));
    });
    next(err, proxies);
  });
}

module.exports = ServerRuntime;

