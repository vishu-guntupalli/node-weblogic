var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var WebAppComponentRuntime = function(proxy) {
  this._attributeFunctions = [ 'CachingDisabled', 'ComponentName', 'ContextRoot', 'DeploymentState',
    'FilterDispatchedRequestsEnabled', 'IndexDirectoryEnabled', 'JSPCompileCommand', 'JSPDebug',
    'JSPKeepGenerated', 'JSPPageCheckSecs', 'JSPVerbose', 'LogFilename', 'MBeanInfo', 'ModuleId',
    'ModuleURI', 'Name', 'ObjectName', 'OpenSessionsCurrentCount', 'OpenSessionsHighCount', 'Parent',
    'Registered', 'ServletReloadCheckSecs', 'ServletSessionsMonitoringIds', 'SessionCookieComment',
    'SessionCookieDomain', 'SessionCookieMaxAgeSecs', 'SessionCookieName', 'SessionCookiePath',
    'SessionIDLength', 'SessionInvalidationIntervalSecs', 'SessionMonitoringEnabled', 'SessionsOpenedTotalCount',
    'SessionTimeoutSecs', 'SingleThreadedServletPoolSize', 'SourceInfo', 'Status', 'Type'
  ];
  SuperMbean.call(this, proxy);
}


util.inherits(WebAppComponentRuntime, SuperMbean);

module.exports = WebAppComponentRuntime;

