var CloneExtend = require('cloneextend');

var defaultConfig = {
  proto: 't3',
  libdir: '.'
}

var ConnectionConfig = function(config) {
  // Apply default values
  config = CloneExtend.extend(defaultConfig, config);
  this.host = config.host;
  this.port = config.port;
  this.username = config.username;
  this.password = config.password;
  this.proto = config.proto;
  this.libDir = config.libDir;
}



module.exports = ConnectionConfig;
