var java = require('java');
var fs = require('fs');


var JavaHelper = function() {
}

module.exports = JavaHelper;

JavaHelper.import = function(javaPackage) {
  return java.import(javaPackage);
}

JavaHelper.classpath_push = function(classpath) {
  // If the classpath does not exist, throw friendly error
  if (!fs.existsSync(classpath)) {
    throw new Error(classpath + ' does not exist');
  }
  java.classpath.push(classpath);
}
