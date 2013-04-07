var Client = require(__dirname + '/../lib/client');

var config = {
  host: "localhost",
  port: 7001,
  username: "weblogic",
  password: "password",
  proto: "t3",
  libDir: "/path/to/weblogic/lib" /* Path to wlfullclient.jar */
};

var weblogic = new Client(config);
weblogic.on('connect', function() {
var states = weblogic.getServerStates();
console.log(JSON.stringify(states, null, '\t'));
});
weblogic.connect();

