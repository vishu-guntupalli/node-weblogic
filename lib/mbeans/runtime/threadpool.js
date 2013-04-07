var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var ThreadPoolRuntime = function(proxy) {
  this._attributeFunctions = [ 'CompletedRequestCount', 'ExecuteThreadIdleCount', 'ExecuteThreads',
    'ExecuteThreadTotalCount', 'HealthState', 'HoggingThreadCount', 'MBeanInfo', 'MinThreadsConstraintsCompleted',
    'MinThreadsConstraintsPending', 'Name', 'ObjectName', 'Parent', 'PendingUserRequestCount', 'QueueLength',
    'SharedCapacityForWorkManagers', 'StandbyThreadCount', 'Throughput', 'Type'
  ];
  this._attributeVars = [ 'Suspended' ];
  this._skipAttributes = [ 'ExecuteThreads', 'Parent' ];
  SuperMbean.call(this, proxy);
}


util.inherits(ThreadPoolRuntime, SuperMbean);

module.exports = ThreadPoolRuntime;

