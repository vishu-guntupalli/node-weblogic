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
Domain.prototype.getAppDeployments = function() {
  var proxies = [];
  this.proxy.getAppDeploymentsSync().forEach(function(proxy) {
    proxies.push(new AppDeployment(proxy));
  });
  return proxies;
}

Domain.prototype.getJDBCSystemResources = function() {
  var proxies = [];
  this.proxy.getJDBCSystemResourcesSync().forEach(function(proxy) {
    proxies.push(new JDBCSystemResource(proxy));
  });
  return proxies;
}

Domain.prototype.getClusters = function() {
  var proxies = [];
  this.proxy.getClustersSync().forEach(function(proxy) {
    proxies.push(new Cluster(proxy));
  });
  return proxies;
}

Domain.prototype.getServers = function() {
  var proxies = [];
  this.proxy.getServersSync().forEach(function(proxy) {
    proxies.push(new Server(proxy));
  });
  return proxies;
}

module.exports = Domain;



