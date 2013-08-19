var DomainRuntime = require(__dirname + '/domain');
var ServerLifeCycleRuntime = require(__dirname + '/server-life-cycle');
var ServerRuntime = require(__dirname + '/server');
var Domain = require(__dirname + '/../config/domain');
var AppRuntimeStateRuntime = require(__dirname + '/app-runtime-state');

var DomainRuntimeService = function(connection) {
  this.connection = connection;
  this.service = 'com.bea:Name=DomainRuntimeService,Type=weblogic.management.mbeanservers.domainruntime.DomainRuntimeServiceMBean';
}

exports.getInstance = function(connection, next) {
  var drs = new DomainRuntimeService(connection);
  connection.getProxyInstance(drs.service, function(err, result) {
    drs.proxy = result;
    drs.proxy.getDomainConfiguration(function(err, result) {
      drs.domainConfig = result;
      next(err, drs);
    });
  });
}

// Related MBeans
DomainRuntimeService.prototype.getDomain = function(next) {
  this.proxy.getDomainConfiguration(function(err, result) {
    if (err) { next(err, null) }
    next(err, new Domain(result));
  });
}

DomainRuntimeService.prototype.getServerRuntimes = function(next) {
  this.proxy.getServerRuntimes(next);
}

// Operations
DomainRuntimeService.prototype.findService = function(name, type, next) {
  this.proxy.findService(name, type, null, next);
}

// DomainConfig
DomainRuntimeService.prototype.getClustersConfig = function(next) {
  this.domainConfig.getClusters(next);
}

DomainRuntimeService.prototype.getName = function(next) {
  return this.domainConfig.getName();
}

// DomainRuntime
DomainRuntimeService.prototype.getServerLifeCycleRuntime = function(server, next) {
  this.proxy.getDomainRuntime(function(err, result) {
    if (err) { return next(); }
    var domainRuntime = new DomainRuntime(result);
    domainRuntime.lookupServerLifeCycleRuntime(server, function(err, result) {
      next(err, new ServerLifeCycleRuntime(result));
    });
  });
}

DomainRuntimeService.prototype.getServerRuntime = function(serverName, next) {
  var serverRuntime = 'com.bea:Name=' + serverName + ',Location=' + serverName + ',Type=ServerRuntime';
  this.connection.getProxyInstance(serverRuntime, function(err, result) {
    if (err) { return next(err, undefined); }
    next(err, new ServerRuntime(result));
  });
}

DomainRuntimeService.prototype.getAppRuntimeStateRuntime = function(next) {
  this.proxy.getAppRuntimeStateRuntime(function(err, result) {
    next(err, new AppRuntimeStateRuntime(result));
  });
}


//module.exports = DomainRuntimeService;

