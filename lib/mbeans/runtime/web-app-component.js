var SuperMbean = require(__dirname + '/../base').SuperMbean;
var util = require('util');

var WebAppComponentRuntime = function(proxy) {
  this._attributeFunctions = [ 'ComponentName', 'ContextRoot', 'DeploymentState', 'JSPCompileCommand', 
    'JSPPageCheckSecs', 'LogFilename', 'MBeanInfo', 'ModuleId',
    'ModuleURI', 'Name', 'ObjectName', 'OpenSessionsCurrentCount', 'OpenSessionsHighCount', 'Parent',
    'ServletReloadCheckSecs', 'ServletSessionsMonitoringIds', 'SessionCookieComment',
    'SessionCookieDomain', 'SessionCookieMaxAgeSecs', 'SessionCookieName', 'SessionCookiePath',
    'SessionIDLength', 'SessionInvalidationIntervalSecs', 'SessionsOpenedTotalCount',
    'SessionTimeoutSecs', 'SingleThreadedServletPoolSize', 'SourceInfo', 'Status', 'Type'
  ];
  this._attributeVars = [ 'CachingDisabled', 'FilterDispatchedRequestsEnabled', 'IndexDirectoryEnabled',
    'JSPDebug', 'JSPKeepGenerated', 'JSPVerbose', 'Registered', 'SessionMonitoringEnabled'
  ];
  SuperMbean.call(this, proxy);
}


util.inherits(WebAppComponentRuntime, SuperMbean);

module.exports = WebAppComponentRuntime;

