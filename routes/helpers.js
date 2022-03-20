const crypto = require('crypto');
const webcrypto = require('webcrypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
	
	return { loggedIn: payload.data._id == user._id, u_id: payload.data._id };
    } catch (err) {
	return { loggedIn: false, u_id: null };
    }
}

module.exports = { encrypt_pass, loginToken, loggedIn };
