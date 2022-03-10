const crypto = require('crypto');
const webcrypto = require('webcrypto');
const bcrypt = require('bcrypt');
const jose = require('jose');
require('dotenv').config();

async function encrypt_pass(password) {
    return await bcrypt.hash(password, process.env.HASH_ROUNDS);
}

async function loginToken(user) {    
    try {
	return await new jose.SignJWT({})
	    .setProtectedHeader({ alg: 'HS256' })
	    .setIssuedAt(Date.now())
	    .setAudience(user._id)
	    .setExpirationTime('2h')
	    .sign(await crypto.createSecretKey(process.env.KEY));
    } catch (err) {
	return null;
    }
}

async function loggedIn(token) {
    try{
	const { payload, header } = await jose.jwtVerify(token, await crypto.createSecretKey(process.env.KEY));
	console.log(`Payload: ${payload}`);
	return { loggedIn: payload.aud == user._id, u_id: payload.aud };
    } catch (err) {
	return { loggedIn: false, u_id: null };
    }
}

module.exports = { encrypt_pass, loginToken, loggedIn };
