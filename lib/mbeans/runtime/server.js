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
ServerRuntime.prototype.getJVMRuntime = function() {
  return new JVMRuntime(this.proxy.getJVMRuntimeSync());
}

ServerRuntime.prototype.getThreadPoolRuntime = function() {
  return new ThreadPoolRuntime(this.proxy.getThreadPoolRuntimeSync());
}

ServerRuntime.prototype.getJDBCServiceRuntime = function() {
  return new JDBCServiceRuntime(this.proxy.getJDBCServiceRuntimeSync());
}

ServerRuntime.prototype.getApplicationRuntimes = function() {
  var proxies = [];
  this.proxy.getApplicationRuntimesSync().forEach(function(proxy) {
    proxies.push(new ApplicationRuntime(proxy));
  });
  return proxies;
}

module.exports = ServerRuntime;

