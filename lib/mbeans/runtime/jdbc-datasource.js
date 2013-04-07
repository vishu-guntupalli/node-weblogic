var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var JDBCDataSourceRuntime = function(proxy) {
  this._attributeFunctions = [ 'ActiveConnectionsAverageCount', 'ActiveConnectionsCurrentCount', 'ActiveConnectionsHighCount',
    'ConnectionDelayTime', 'ConnectionsTotalCount', 'CurrCapacity', 'CurrCapacityHighCount', 'DeploymentState', 'Enabled',
    'FailedReserveRequestCount', 'FailuresToReconnectCount', 'HighestNumAvailable', 'HighestNumUnavailable', 'LeakedConnectionCount',
    'MBeanInfo', 'ModuleId', 'Name', 'NumAvailable', 'NumUnavailable', 'ObjectName', 'Parent', 'PrepStmtCacheAccessCount', 'PrepStmtCacheAddCount',
    'PrepStmtCacheCurrentSize', 'PrepStmtCacheDeleteCount', 'PrepStmtCacheHitCount', 'PrepStmtCacheMissCount', 'Properties',
    'ReserveRequestCount', 'State', 'Type', 'VersionJDBCDriver', 'WaitingForConnectionCurrentCount', 'WaitingForConnectionFailureTotal',
    'WaitingForConnectionHighCount', 'WaitingForConnectionSuccessTotal', 'WaitingForConnectionTotal', 'WaitSecondsHighCount'
  ];
  SuperMbean.call(this, proxy);
}


util.inherits(JDBCDataSourceRuntime, SuperMbean);

module.exports = JDBCDataSourceRuntime;

