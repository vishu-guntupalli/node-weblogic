var EventEmitter = require('events').EventEmitter;
var util = require('util');
var JavaHelper = require(__dirname + '/java-helper');


var Connection = function(config) {
  EventEmitter.call(this);
  this.host = config.host;
  this.port = config.port;
  this.username = config.username;
  this.password = config.password;
  this.proto = config.proto;
  this.libDir = config.libDir;
  this._init();
}

util.inherits(Connection, EventEmitter);

// Imports
Connection.prototype._init = function() {
  JavaHelper.classpath_push(this.libDir + '/wlfullclient.jar');
  this.JMXServiceURL = JavaHelper.import('javax.management.remote.JMXServiceURL');
  this.Hashtable = JavaHelper.import('java.util.Hashtable');
  this.Context = JavaHelper.import('javax.naming.Context');
  this.JMXConnectorFactory = JavaHelper.import('javax.management.remote.JMXConnectorFactory');
  this.ObjectName = JavaHelper.import('javax.management.ObjectName');
  this.MBeanServerInvocationHandler = JavaHelper.import('weblogic.management.jmx.MBeanServerInvocationHandler');
}

Connection.prototype.connect = function() {
  var mserver = 'weblogic.management.mbeanservers.domainruntime';
  var serviceURL = new this.JMXServiceURL(this.proto, this.host, this.port,
    '/jndi/' + mserver);
  var configHash = new this.Hashtable();
  configHash.putSync(this.Context.SECURITY_PRINCIPAL, this.username);
  configHash.putSync(this.Context.SECURITY_CREDENTIALS, this.password);
  configHash.putSync(this.JMXConnectorFactory.PROTOCOL_PROVIDER_PACKAGES, 'weblogic.management.remote');
  var conn = this.JMXConnectorFactory.connectSync(serviceURL, configHash);
  try {
    this.mbconn = conn.getMBeanServerConnectionSync();
    this.emit('connect');
  } catch (e) {
    console.log(e);
    this.emit('error', e);
  }
}

Connection.prototype.getProxyInstance = function(objectName) {
    return this.MBeanServerInvocationHandler.newProxyInstanceSync(this.mbconn, new this.ObjectName(objectName));
};

module.exports = Connection;

