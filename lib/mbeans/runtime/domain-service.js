var DomainRuntime = require(__dirname + '/domain');
var ServerLifeCycleRuntime = require(__dirname + '/server-life-cycle');
var ServerRuntime = require(__dirname + '/server');
var Domain = require(__dirname + '/../config/domain');
var AppRuntimeStateRuntime = require(__dirname + '/app-runtime-state');

var DomainRuntimeService = function(connection) {
  this.connection = connection;
  this.service = 'com.bea:Name=DomainRuntimeService,Type=weblogic.management.mbeanservers.domainruntime.DomainRuntimeServiceMBean';
  this.proxy = connection.getProxyInstance(this.service);
  this.domainConfig = this.proxy.getDomainConfigurationSync();
}

// Related MBeans
DomainRuntimeService.prototype.getDomain = function() {
  return new Domain(this.proxy.getDomainConfigurationSync());
}

DomainRuntimeService.prototype.getServerRuntimes = function() {
  return this.proxy.getServerRuntimesSync();
}

// Operations
DomainRuntimeService.prototype.findService = function(name, type) {
  return this.proxy.findServiceSync(name, type, null);
}

// DomainConfig
DomainRuntimeService.prototype.getClustersConfig = function() {
  return this.domainConfig.getClustersSync();
}

DomainRuntimeService.prototype.getName = function() {
  return this.domainConfig.getNameSync();
}

// DomainRuntime
DomainRuntimeService.prototype.getServerLifeCycleRuntime = function(server) {
  var domainRuntime = new DomainRuntime(this.proxy.getDomainRuntimeSync());
  return new ServerLifeCycleRuntime(domainRuntime.lookupServerLifeCycleRuntime(server));
}

DomainRuntimeService.prototype.getServerRuntime = function(serverName) {
  var serverRuntime = 'com.bea:Name=' + serverName + ',Location=' + serverName + ',Type=ServerRuntime';
  try {
    return new ServerRuntime(this.connection.getProxyInstance(serverRuntime));
  } catch (e) {
    return undefined;
  }
}

DomainRuntimeService.prototype.getAppRuntimeStateRuntime = function() {
  return new AppRuntimeStateRuntime(this.proxy.getAppRuntimeStateRuntimeSync());
}


module.exports = DomainRuntimeService;

