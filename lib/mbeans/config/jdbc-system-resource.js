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
JDBCSystemResource.prototype.getJDBCResource = function(next) {
  this.proxy.getJDBCResource(function(err, result) {
    next(err, new JDBCDataSource(result));
  });
}

JDBCSystemResource.prototype.getTargets = function(next) {
  var proxies = [];
  this.proxy.getTargets(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new Target(proxy));
    });
    next(err, result);
  });
}

module.exports = JDBCSystemResource;

