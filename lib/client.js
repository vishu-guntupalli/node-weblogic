var EventEmitter = require('events').EventEmitter;
var ConnectionConfig = require(__dirname + '/connection-config');
var Connection = require(__dirname + '/connection');
var util = require('util');
var ce = require('cloneextend');
var async = require('async');

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

  this.state = {
    env: this.config.env,
    runtime: {
      servers: []
    }
  };
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function(next) {
  var self = this;
  this.connection = new Connection(this.config);
  this.connection.connect(function(err) {
    if (err) { next(err) }
    try {
      DomainRuntimeService.getInstance(self.connection, function(err, drs) {
        self.drs = drs;
        self.drs.getDomain(function(err, result) {
          if (err) { next(err) }
          self.wlsdomain = result;
          next(err);
        });
      });
    } catch(e) {
      console.log('Got error: ' + e);
      next(e);
    }
  });

}

Client.prototype.getServerStates = function(next) {
  var self = this;
  var servers = {}
  var domainRuntimeConfig = {}
  try {
    async.parallel([
      function(callback) {
        self.getDomainConfig(function(err, result) {
          self.state.domain = result;
          callback(err);
        });
      },
      function(callback) {
        self.getClustersConfig(function(err, result) {
          self.state.clusters = result;
          callback(err);
        });
      },
      // Get all applications from config
      function(callback) {
        self.getApplicationsConfig(function(err, result) {
          self.state.applications = result;
          callback(err);
        });
      },
      function(callback) {
        self.getJDBCConfig(function(err, result) {
          self.state.jdbc = result;
          callback(err);
        });
      },
      function(callback) {
        self.getServersConfig(function(err, result) {
          self.state.servers = result;
          callback(err);
        });
      },
      // Get all applications from config
    ], function(err) {
      // Loop through all servers
      async.forEach(self.state.servers, function(serverConfig, callback) {
        // Get Server's runtime config
        self.getServerRuntime(serverConfig.name, function(err, result) {
          if (result !== undefined) {
            self.state.runtime.servers.push(result);
          }
          callback();
        });
      }, function(err) {
        next(err, self.state);
      });
    });
  } catch(e) {
    console.log('Got error: ' + e);
    next(e, self.state);
  }
}

Client.prototype.getClustersConfig = function(next) {
  var self = this;
  var clusters = [];
  this.wlsdomain.getClusters(function(err, result) {
    if (err) { return next(err); }
    async.forEach(result, function(cluster, callback) {
      cluster.getAllAttributes(function(err, result) {
        clusters.push(result);
        callback(err);
      });
    }, function(err) {
      next(err, clusters);
    });
  });
}

Client.prototype.getDomainConfig = function(next) {
  this.wlsdomain.getAllAttributes(next);
}

Client.prototype.getApplicationsConfig = function(next) {
  var self = this;
  var applications = [];
  this.wlsdomain.getAppDeployments(function(err, result) {
    async.forEach(result, function(application, callback) {
      application.getApplicationName(function(err, appName) {
        if (err) { return callback(err); }
        application.getVersionIdentifier(function(err, appVersion) {
          if (err) { return callback(err); }
          application.getTargets(function(err, targets) {
            if (err) { return callback(err); }
            applications.push({ name: appName, version: appVersion, targets: getTargets(targets)});
            callback(err);
          });
        });
      });
    }, function(err) {
      next(err, applications);
    });
  });
}

Client.prototype.getJDBCConfig = function(next) {
  var self = this;
  var jdbc = [];
  this.wlsdomain.getJDBCSystemResources(function(err, result) {
    async.forEach(result, function(jdbcSystemResource, callback) {
      jdbcSystemResource.getJDBCResource(function(err, ds) {
        if (err) { return callback(err); }
        ds.getName(function(err, dsName) {
          if (err) { return callback(err); }
          ds.getJDBCDriverParams(function(err, dsParams) {
            dsParams.getAllAttributes(function(err, params) {
              if (err) { return callback(err); }
              jdbcSystemResource.getTargets(function(err, targets) {
                if (err) { return callback(err); }
                jdbc.push({name: dsName, params: params, targets: getTargets(targets)});
              });
            });
          });
        });
      });
    }, function(err) {
      next(err, jdbc);
    });
  });
}

Client.prototype.getServersConfig = function(next) {
  var self = this;
  var servers = [];
  this.wlsdomain.getServers(function(err, result) {
    if (err) { return next(err); }
    async.forEach(result, function(server, callback) {
      server.getAllAttributes(function(err, serverConfig) {
        if (err) { return callback(err); }
        server.getCluster(function(err, cluster) {
          if (err) { return callback(err); }
          getCluster(cluster, function(err, clusterParams) {
            if (err) { return callback(err); }
            servers.push(ce.cloneextend(serverConfig, { cluster: clusterParams }));
            callback(err);
          });
        });
      });
    }, function(err) {
      next(err, servers);
    });
  });
}

function getTargets(targets) {
  var ret = {};
  targets.forEach(function(target) {
    var targetName = target.getName();
    ret[targetName] = target.getAllAttributes();
  });
  return ret;
}

function getCluster(cluster, next) {
  var ret = {};
  if (cluster.proxy !== null) {
    return cluster.getAllAttributes(next);
  }
  return next();
}

Client.prototype.getServerRuntime = function(serverName, next) {
  var self = this;
  var serverRuntime = {};
  var runtime = {
    apps: [],
    jdbc: []
  };
  async.series([
    function(callback) {
      self.drs.getServerRuntime(serverName, function(err, result) {
        serverRuntime = result;
        if (serverRuntime === undefined) { return callback('No ServerRuntime'); }
        callback(err);
      });
    },
    function(callback) {
      serverRuntime.getAllAttributes(function(err, result) {
        runtime.runtime = result
        callback(err);
      });
    },
    function(callback) {
      self.drs.getServerLifeCycleRuntime(serverName, function(err, result) {
        runtime.lifecycle = result;
        callback(err);
      });
    },
    function(callback) {
      serverRuntime.getJVMRuntime(function(err, jvmRuntime) {
        if (err) { return callback(err); }
        jvmRuntime.getAllAttributes(function(err, result) {
          runtime.jvm = result;
          callback(err);
        });
      });
    },
    function(callback) {
      serverRuntime.getThreadPoolRuntime(function(err, threadPoolRuntime) {
        threadPoolRuntime.getAllAttributes(function(err, result) {
          runtime.threadPool = result;
          callback(err);
        });
      });
    },
    function(callback) {
      // Get Runtime JDBC Status
      serverRuntime.getJDBCServiceRuntime(function(err, jdbcServiceRuntime) {
        jdbcServiceRuntime.getJDBCDataSourceRuntimes(function(err, jdbcDataSourceRuntimes) {
          async.forEach(jdbcDataSourceRuntimes, function(ds, callback) {
            ds.getAllAttributes(function(err, result) {
              runtime.jdbc.push(result);
              callback(err);
            });
          }, function(err) {
            callback(err);
          });
        });
      });
    },
    function(callback) {
      self.getApplicationRuntimes(serverRuntime, function(err, result) {
        runtime.apps = result;
        callback(err);
      });
    }
  ], function(err) {
      // If there's no runtime, just return empty
      if (serverRuntime === undefined) {
        return next(err, undefined);
      }
      next(err, runtime);
  });
}

Client.prototype.getApplicationRuntimes = function(serverRuntime, next) {
  // Get Runtime Application Status
  var apps = [];
  serverRuntime.getApplicationRuntimes(function(err, result) {
    async.forEach(result, function(app, callback) {
      var appRuntime;
      var runtimes = [];
      async.series([
        function(callback) {
          app.getAllAttributes(function(err, result) {
            appRuntime = result;
            appRuntime.components = [];
            callback(err);
          });
        },
        function(callback) {
          app.getComponentRuntimes(function(err, result) {
            runtimes = result;
            callback(err);
          });
        },
        function(callback) {
          async.forEach(runtimes, function(comp, callback) {
            comp.getAllAttributes(function(err, component) {
              comp.getSubtype(component.Type, function(err, subType) {
                if (subType) {
                  subType.getAllAttributes(function(err, result) {
                    component.subType = result;
                    appRuntime.components.push(component);
                    callback(err);
                  });
                } else {
                  appRuntime.components.push(component);
                  callback(err);
                }
              });
            });
          }, function(err) {
            if (err) { return callback(err); }
            apps.push(appRuntime);
            callback(err);
          });
        }
      ], function(err) {
        callback(err);
      });
    }, function(err) {
      next(err, apps);
    });
  });
}

module.exports = Client;
