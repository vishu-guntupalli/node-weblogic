var EventEmitter = require('events').EventEmitter;
var ConnectionConfig = require(__dirname + '/connection-config');
var Connection = require(__dirname + '/connection');
var util = require('util');
var ce = require('cloneextend');

var Cluster = require(__dirname + '/mbeans/config/cluster');
var Server = require(__dirname + '/mbeans/config/server');
var DomainRuntimeService = require(__dirname + '/mbeans/runtime/domain-service');
var ServerRuntime = require(__dirname + '/mbeans/runtime/server');
var ServerLifeCycleRuntime = require(__dirname + '/mbeans/runtime/server-life-cycle');
var JVMRuntime = require(__dirname + '/mbeans/runtime/jvm');
var ThreadPoolRuntime = require(__dirname + '/mbeans/runtime/threadpool');


var Client = function(config) {
  EventEmitter.call(this);
  this.config = new ConnectionConfig(config);

  this.state = {env: this.config.env};
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function() {
  var self = this;
  this.connection = new Connection(this.config);
  this.connection.on('connect', function() {
    try {
      self.drs = new DomainRuntimeService(self.connection);
      self.wlsdomain = self.drs.getDomain();
    } catch(e) {
      console.log('Got error: ' + e);
    }
    self.emit('connect');
  });

  this.connection.connect();
}

Client.prototype.getServerStates = function() {
  var self = this;
  var servers = {}
  var domainRuntimeConfig = {}
  try {
    self.state.domain = self.getDomainConfig();
    self.state.clusters = self.getClustersConfig();
    // Get all applications from config
    self.state.applications = self.getApplicationsConfig();
    self.state.jdbc = self.getJDBCConfig();
    self.state.servers = self.getServersConfig()

    // Loop through all servers
    self.state.runtime = {};
    self.state.runtime.servers = [];
    self.state.servers.forEach(function(serverConfig) {
      // Get Server's runtime config
      var runtime = self.getServerRuntime(serverConfig.name);
      if (runtime !== undefined) {
        self.state.runtime.servers.push(runtime);
      }
    });
  } catch(e) {
    console.log('Got error: ' + e);
  }

  return self.state;
}

Client.prototype.getClustersConfig = function() {
  var self = this;
  var clusters = [];
  this.wlsdomain.getClusters().forEach(function(cluster) {
    var clusterConfig = cluster.getAllAttributes();
    clusters.push(clusterConfig);
  });
  return clusters;
}

Client.prototype.getDomainConfig = function() {
    return this.wlsdomain.getAllAttributes();
}

Client.prototype.getApplicationsConfig = function() {
  var self = this;
  var applications = [];
  this.wlsdomain.getAppDeployments().forEach(function(application) {
    var appName = application.getApplicationName();
    var appVersion = application.getVersionIdentifier();
    applications.push({ name: appName, version: appVersion, targets: getTargets(application.getTargets())});
  });
  return applications;
}

Client.prototype.getJDBCConfig = function() {
  var self = this;
  var jdbc = [];
  this.wlsdomain.getJDBCSystemResources().forEach(function(jdbcSystemResource) {
    var ds = jdbcSystemResource.getJDBCResource();
    var dsName = ds.getName();
    var dsParams = ds.getJDBCDriverParams();
    jdbc.push({name: dsName, params: dsParams.getAllAttributes(), targets: getTargets(jdbcSystemResource.getTargets())});
  });
  return jdbc;
}

Client.prototype.getServersConfig = function() {
  var self = this;
  var servers = [];
  this.wlsdomain.getServers().forEach(function(server) {
    var serverConfig = server.getAllAttributes();
    servers.push(ce.cloneextend(serverConfig, { cluster: getCluster(server.getCluster()) }));
  });
  return servers
}

function getTargets(targets) {
  var ret = {};
  targets.forEach(function(target) {
    var targetName = target.getName();
    ret[targetName] = target.getAllAttributes();
  });
  return ret;
}

function getCluster(cluster) {
  var ret = {};
  if (cluster.proxy !== null) {
    ret = cluster.getAllAttributes();
  }
  return ret;
}

Client.prototype.getServerRuntime = function(serverName) {
    var self = this;
    var serverRuntime = this.drs.getServerRuntime(serverName);
    var runtime = {};

    // If there's no runtime, just return empty
    if (serverRuntime === undefined) {
      return undefined;
    }

    runtime.runtime = serverRuntime.getAllAttributes();
    runtime.lifecycle = self.drs.getServerLifeCycleRuntime(serverName);

    var jvmRuntime = serverRuntime.getJVMRuntime();
    runtime.jvm = jvmRuntime.getAllAttributes();

    var threadPoolRuntime = serverRuntime.getThreadPoolRuntime();
    runtime.threadPool = threadPoolRuntime.getAllAttributes();

    // Get Runtime JDBC Status
    var jdbcServiceRuntime = serverRuntime.getJDBCServiceRuntime();
    var jdbcDataSourceRuntimes = jdbcServiceRuntime.getJDBCDataSourceRuntimes();
    runtime.jdbc = [];
    jdbcDataSourceRuntimes.forEach(function(ds) {
      runtime.jdbc.push(ds.getAllAttributes());
    });

    // Get Runtime Application Status
    runtime.apps = [];
    serverRuntime.getApplicationRuntimes().forEach(function(app) {
      var appRuntime = app.getAllAttributes();
      appRuntime.components = [];
      app.getComponentRuntimes().forEach(function(comp) {
        var component = comp.getAllAttributes();
        var subType = comp.getSubtype();
        if (subType !== undefined) {
          component.subType = subType.getAllAttributes();
        }
        appRuntime.components.push(component);
      });
      runtime.apps.push(appRuntime);
    });

    return runtime;
}

module.exports = Client;
