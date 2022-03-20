const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

async function encrypt_pass(password) {
    return await bcrypt.hash(password, process.env.HASH_ROUNDS);
}

async function loginToken(user) {
    return jwt.sign({ data: user._id },
		    process.env.KEY,
		    { expiresIn: '7d' });
}

async function loggedIn(token) {
    try{
	const data = jwt.verify(token, process.env.KEY);
	const id = mongoose.Types.ObjectId(data.data);
	
	const user = await User.findById(id, '_id email');

	return { loggedIn: id.toString() == user._id.toString(), user: user };
    } catch (err) {
	return { loggedIn: false, u_id: null };
    }
}

module.exports = { encrypt_pass, loginToken, loggedIn };
