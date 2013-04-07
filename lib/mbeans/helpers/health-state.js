var JavaHelper = require(__dirname + '/../../java-helper');


var HealthState = function() {
};

module.exports = HealthState;

HealthState.getStateAsText = function(healthState) {
  // Imports
  if (this.WLHealthState === undefined) {
    this.WLHealthState = JavaHelper.import('weblogic.health.HealthState');
  }

  var code = healthState.getStateSync();
  if (code === this.WLHealthState.HEALTH_CRITICAL) {
    return 'CRITICAL';
  }
  if (code === this.WLHealthState.HEALTH_FAILED) {
    return 'FAILED';
  }
  if (code === this.WLHealthState.HEALTH_OK) {
    return 'OK';
  }
  if (code === this.WLHealthState.HEALTH_OVERLOADED) {
    return 'OVERLOADED';
  }
  if (code === this.WLHealthState.HEALTH_WARN) {
    return 'WARN';
  }
  return 'UNKNOWN';
}
