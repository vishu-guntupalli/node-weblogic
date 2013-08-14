var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var AppDeployment = require(__dirname + '/app-deployment');
var JDBCSystemResource = require(__dirname + '/jdbc-system-resource');
var Cluster = require(__dirname + '/cluster');
var Server = require(__dirname + '/server');

var Domain = function(proxy) {
  this._attributeFunctions = [ 
    'AdministrationPort', 
    'AdministrationProtocol', 
    'AdminServerName', 
    'ArchiveConfigurationCount', 
    'ConfigurationAuditType', 
    'ConfigurationVersion', 
    'ConsoleContextPath', 
    'ConsoleExtensionDirectory', 
    'DomainVersion', 
    'LastModificationTime', 
    'MBeanInfo', 
    'Name', 
    'Notes', 
    'ObjectName', 
    'Parent', 
    'RootDirectory', 
    'Type' 

];
  this._attributeVars = [ 
    'AdministrationMBeanAuditingEnabled', 
    'AdministrationPortEnabled', 
    'ClusterConstraintsEnabled', 
    'ConfigBackupEnabled', 
    'ConsoleEnabled', 
    'GuardianEnabled', 
    'InternalAppsDeployOnDemandEnabled', 
    'ProductionModeEnabled', 
];
  SuperMbean.call(this, proxy);
}

util.inherits(Domain, SuperMbean);

// Child MBeans
Domain.prototype.getAppDeployments = function(next) {
  var proxies = [];
  this.proxy.getAppDeployments(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new AppDeployment(proxy));
    });
    next(err, proxies);
  });
}

Domain.prototype.getJDBCSystemResources = function(next) {
  var proxies = [];
  this.proxy.getJDBCSystemResources(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new JDBCSystemResource(proxy));
    });
    next(err, proxies);
  });
}

Domain.prototype.getClusters = function(next) {
  var proxies = [];
  this.proxy.getClusters(function(err, result) {
    if (err) { return next(err); }
    result.forEach(function(proxy) {
      proxies.push(new Cluster(proxy));
    });
    next(err, proxies);
  });
}

Domain.prototype.getServers = function(next) {
  var proxies = [];
  this.proxy.getServers(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new Server(proxy));
    });
    return next(err, proxies);
  });
}

module.exports = Domain;



