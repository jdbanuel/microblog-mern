const mongoose = require('mongoose');

//User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("User", UserSchema);