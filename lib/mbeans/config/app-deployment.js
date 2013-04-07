var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var Target = require(__dirname + '/target');

var AppDeployment = function(proxy) {
  this._attributeFunctions = [ 'AbsoluteInstallDir', 'AbsolutePlanDir', 'AbsolutePlanPath', 'AbsoluteSourcePath', 'ApplicationIdentifier', 'ApplicationName', 'CompatibilityName', 'DeploymentOrder', 'DeploymentPrincipalName', 'InstallDir', 'MBeanInfo', 'ModuleType', 'Name', 'Notes', 'ObjectName', 'Parent', 'PlanDir', 'PlanPath', 'Registered', 'SecurityDDModel', 'SourcePath', 'StagingMode', 'Type', 'ValidateDDSecurityData', 'VersionIdentifier'
];
  SuperMbean.call(this, proxy);
}

util.inherits(AppDeployment, SuperMbean);

// Child MBeans
AppDeployment.prototype.getTargets = function() {
  var proxies = [];
  this.proxy.getTargetsSync().forEach(function(proxy) {
    proxies.push(new Target(proxy));
  });
  return proxies;
}

module.exports = AppDeployment;

