var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');
var JDBCDataSource = require(__dirname + '/jdbc-datasource');
var Target = require(__dirname + '/target');

var JDBCSystemResource = function(proxy) {
  this._attributeFunctions = [ 'CompatibilityName', 'DeploymentOrder', 'DeploymentPrincipalName', 'DescriptorFileName',
    'MBeanInfo', 'ModuleType', 'Name', 'Notes', 'ObjectName', 'Parent', 'SourcePath', 'Type'
];
  SuperMbean.call(this, proxy);
}

util.inherits(JDBCSystemResource, SuperMbean);

// Child MBeans
JDBCSystemResource.prototype.getJDBCResource = function() {
  return new JDBCDataSource(this.proxy.getJDBCResourceSync());
}

JDBCSystemResource.prototype.getTargets = function() {
  var proxies = [];
  this.proxy.getTargetsSync().forEach(function(proxy) {
    proxies.push(new Target(proxy));
  });
  return proxies;
}

module.exports = JDBCSystemResource;

