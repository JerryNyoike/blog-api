const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
	type: String,
	required: true
    },
    email: {
	type: String,
	required: true
    }
});

default.exports = mongoose.Model('User', UserSchema);
