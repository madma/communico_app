var _ = require('lodash');

var localEnvVars = {
  TITLE:      'communico_app',
  SAFE_TITLE: 'communico_app'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
