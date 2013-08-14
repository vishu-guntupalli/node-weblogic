var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var Cluster = function(proxy) {
  this._attributeFunctions = [ 'AdditionalAutoMigrationAttempts', 'AsyncSessionQueueTimeout', 'AutoMigrationTableName', 'ClusterAddress', 
    'ClusterBroadcastChannel', 'ClusterMessagingMode', 'ClusterType', 'DefaultLoadAlgorithm', 'FencingGracePeriodMillis', 'FrontendHost', 
    'FrontendHTTPPort', 'FrontendHTTPSPort', 'GreedySessionFlushInterval', 'HealthCheckIntervalMillis', 'HealthCheckPeriodsUntilFencing', 
    'IdlePeriodsUntilTimeout', 'InterClusterCommLinkHealthCheckInterval', 'JobSchedulerTableName', 'MBeanInfo', 'MemberWarmupTimeoutSeconds', 
    'MigrationBasis', 'MillisToSleepBetweenAutoMigrationAttempts', 'MulticastAddress', 'MulticastBufferSize', 'MulticastDataEncryption', 
    'MulticastPort', 'MulticastSendDelay', 'MulticastTTL', 'Name', 'Notes', 'NumberOfServersInClusterAddress', 'ObjectName', 'Parent', 
    'PersistSessionsOnShutdown', 'RemoteClusterAddress', 'ReplicationChannel', 'ServiceAgeThresholdSeconds', 'SessionFlushInterval', 
    'SessionFlushThreshold', 'Type', 'WANSessionPersistenceTableName', 
  ];
  this._attributeVars = [ 'ClientCertProxyEnabled', 'HttpTraceSupportEnabled', 'ReplicationTimeoutEnabled', 'SecureReplicationEnabled', 'WeblogicPluginEnabled' ];
  SuperMbean.call(this, proxy);
}

util.inherits(Cluster, SuperMbean);

// Child MBeans
Cluster.prototype.getTargets = function(next) {
  var proxies = [];
  this.proxy.getServers(function(err, result) {
    result.forEach(function(proxy) {
      proxies.push(new Server(proxy));
    });
    next(err, proxies);
  });
}

module.exports = Cluster;

