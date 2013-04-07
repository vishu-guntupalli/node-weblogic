# weblogic
Using JMX to retrieve configuration and runtime metrics from a WebLogic domain.  

## Installation
### Java specific instructions
```bash
$ export JAVA_HOME=/usr/local/share/jdk1.6.0_30
$ npm install
```

Notes:
* node-gyp requires python 2.x not python 3.x. See https://github.com/TooTallNate/node-gyp/issues/155 for more details.
* If you see an error such as "No rule to make target '/opt/jdk1.7.0_09/jre/lib/amd64/server/libjvm.so', needed by 'build/depsVerified'.  Stop."
      this means that your JAVA_HOME is not set correctly and you need to verify the location of libjvm.so or jvm.lib.
* If you see an error such as "Error: The specified module could not be found. 
      xxxxxx\node_modules\java\build\Release\nodejavabridge_bindings.node".
      Ensure the directory where jvm.dll exists is in your PATH. (e.g. C:\Program Files (x86)\Java\jdk1.6.0_18\jre\bin\client).
      This path cannot have quotes.  
  
Source: https://npmjs.org/package/java  
### WebLogic specific instructions  
Retrieve the wlfullclient.jar from the WebLogic lib directory and place in a directory of choice.  
*Instructions on how to generate wlfullclient.jar can be found here: http://docs.oracle.com/cd/E24329_01/web.1211/e24378/jarbuilder.htm*  


## Bundled Example
In bin/example1.js, update the config:
```javascript
  host: "localhost",
  port: 7001,
  username: "weblogic",
  password: "password",
  proto: "t3",
  libDir: "/path/to/weblogic/lib" /* Path to wlfullclient.jar */
```
Run:
```bash
$ node bin/example1.js
```
This will get all available attributes for the domain and print to stdout.


## Usage Example
In package.js, add weblogic dependency:  
```javascript
  "dependencies": {
...
    "weblogic": "0.0.1",
...
},
```

In code, add:
```javascript
var WebLogicClient = require('weblogic');

var config = {
  host: "localhost",
  port: 7001,
  username: "weblogic",
  password: "password",
  proto: "t3",
  libDir: "/path/to/weblogic/lib" /* Path to wlfullclient.jar */
};

var weblogic = new WebLogicClient(config);
weblogic.on('connect', function() {
  /* Add code here */
});
weblogic.connect();
```

## API  
**Object getServerStates();**  
Returns an Object with all configuration and metrics available.  
  
**Array getClustersConfig();**  
Returns a list of all clusters configuration.  
  
**Object getDomainConfig();**  
Returns an Object with the domain configuration.  
  
**Array getApplicationsConfig();**  
Returns a list of all application's configuration.  
  
**Array getJDBCConfig();**  
Returns a list of all jdbc's configuration.  
  
**Array getServersConfig();**  
Returns a list of all servers' configuration.  

**Object getServerRuntime(serverName);**  
Returns an Object with all runtimes, such as application, jdbc, jvm and threadpool.  
