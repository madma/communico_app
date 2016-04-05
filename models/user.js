var mongoose = require("mongoose"),
    debug    = require("debug")("app:models");


var userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
});

// Add bcrypt hashing to model (works on a password field)!
userSchema.plugin(require("mongoose-bcrypt"));

// Add a "transformation" to the model's toJson function that
// stops the password field (even in digest format) from being
// returned in any response.
userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model("User", userSchema);

module.exports = User;
