var EventEmitter = require('events').EventEmitter;
var util = require('util');
var JavaHelper = require(__dirname + '/java-helper');
var async = require('async');


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

Connection.prototype.connect = function(next) {
  var self = this;
  var mserver = 'weblogic.management.mbeanservers.domainruntime';
  var serviceURL = new self.JMXServiceURL(self.proto, self.host, self.port,
    '/jndi/' + mserver);
  var configHash = new self.Hashtable();
  async.parallel([
    function(callback) {
      configHash.put(self.Context.SECURITY_PRINCIPAL, self.username, callback);
    },
    function(callback) {
      configHash.put(self.Context.SECURITY_CREDENTIALS, self.password, callback);
    },
    function(callback) {
      configHash.put(self.JMXConnectorFactory.PROTOCOL_PROVIDER_PACKAGES, 'weblogic.management.remote', callback);
    },
    function(callback) {
      self.JMXConnectorFactory.connect(serviceURL, configHash, function(err, result) {
        self.conn = result;
        callback(err);
      });
    }
  ], function(err) {
    if (err) { next(err); }
    try {
      self.conn.getMBeanServerConnection(function(err, result) {
        if (err) { next(err); }
        self.mbconn = result;
        //self.emit('connect');
        next(err);
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
}

Connection.prototype.getProxyInstance = function(objectName, next) {
    this.MBeanServerInvocationHandler.newProxyInstance(this.mbconn, new this.ObjectName(objectName), next);
};

module.exports = Connection;

