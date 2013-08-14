var JavaHelper = require(__dirname + '/../../java-helper');


var HealthState = function() {
};

module.exports = HealthState;

HealthState.getStateAsText = function(healthState, next) {
  var self = this;
  // Imports
  if (this.WLHealthState === undefined) {
    this.WLHealthState = JavaHelper.import('weblogic.health.HealthState');
  }

  healthState.getState(function(err, code) {
    var state = 'UNKNOWN';
    if (code === self.WLHealthState.HEALTH_CRITICAL) {
      state = 'CRITICAL';
    }
    if (code === self.WLHealthState.HEALTH_FAILED) {
      state = 'FAILED';
    }
    if (code === self.WLHealthState.HEALTH_OK) {
      state = 'OK';
    }
    if (code === self.WLHealthState.HEALTH_OVERLOADED) {
      state = 'OVERLOADED';
    }
    if (code === self.WLHealthState.HEALTH_WARN) {
      state = 'WARN';
    }
    next(err, state);
  });
}
