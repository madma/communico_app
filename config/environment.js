var _ = require('lodash');

var localEnvVars = {
  TITLE:      'communico_app',
  SAFE_TITLE: 'communico_app',
  COOKIE_SECRET:  'notsosecretnowareyou',
  SESSION_SECRET: 'anotherfoolishsecret',
  TOKEN_SECRET:   'andafinalsecretsadasitis'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
