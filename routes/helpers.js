const bcrypt = require('bcrypt');

async function encrypt_pass() {
    const pass_salt = bcrypt.salt(10);

    return await bcrypt.hash(password, pass_salt());
}

async function loginToken(user) {
    try {
	const token = await jose.SignJWT()
	      .setProtectedHeader({})
	      .setIssuedAt(Date.now())
	      .setAudience(user._id)
	      .setExpirationTime('2d')
	      .sign(process.env.KEY)

	return token;
    } catch (err) {
	return null;
    }
}

async function loggedIn(token) {
    try{
	const { payload, header } = await jose.jwtVerify(token, process.env.KEY);
	return { loggedIn: payload.aud == user._id, u_id: payload.aud };
    } catch (err) {
	return false;
    }
}

module.exports = { encrypt_pass, loginToken };
