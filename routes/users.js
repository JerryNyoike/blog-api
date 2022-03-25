const express = require('express');
const bcrypt = require('bcrypt');
const helpers = require('./helpers.js');

const router = express.Router();
const User = require('../models/User');

/**
* @openapi
* /users:
*       get:
*          description: Fetch all users in the Database
*          responses:
*              200:
*                description: Returns a list of users.
*              500:
*                description: Failure due to a server error.
*/
router.get('/', async (req, res) => {
    try{
	const users = await User.find({}, '_id username email');
	res.json(users);
    } catch (err) {
	res.status(500).json({ message: err });
    }
});

/**
* @openapi
* /users/{user_id}:
*       get:
*          description: Fetch the user whose id matches the one provided.
*          parameters:
*              - in: path
*                name: user_id
*                type: string
*                required: true
*                description: Users id
*          responses:
*              200:
*                description: Returns the specified user.
*              500:
*                description: Failure due to a server error.
*/
router.get('/:u_id', async (req, res) => {
    try{
	const user = await User.findById(u_id, '_id username email');
	res.status(200).json(user);
    } catch(err) {
	res.json({ message: err });
    }
});

/** @openapi
* /users:
*       post:
*          description: Register a new user.
*          requestBody:
*              content:
*                application/json:
*                  schema:
*                    username:
*                      description: Users intended username.
*                      required: true
*                    email:
*                      description: Users intended email.
*                      required: true
*                    password:
*                      description: Users intended password.
*                      required: true
*          responses:
*              200:
*                description: New user is created in the system.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.post('/', async (req, res) => {
    const body = req.body;

    if (!body.username || !body.email || !body.password)
        return res.status(400).json({ message: 'Invalid data' });

    const exists = await User.findOne({ username: body.username });

    const user = new User({
        username: body.username,
        email: body.email,
        password: body.password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt)

    try {
	const savedUser = await user.save();
	res.status(200).json({ message: "Success" });
    } catch (err) {
	const { _message:error } = err;
	res.status(400).json({ message: error });
    }
});

/** @openapi
* /users:
*       post:
*          description: Login a registered user.
*          requestBody:
*              content:
*                application/json:
*                  schema:
*                    email:
*                      description: Users email.
*                      required: true
*                    password:
*                      description: Users password.
*                      required: true
*          responses:
*              200:
*                description: User is created logged into the system.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.post('/login', async (req, res) => {
    const body = req.body;
    try {
	const user = await User.findOne({ email: body.email });

	await bcrypt.compare(body.password, user.password, async (err, result) => {
	    if (err || !result) {
		res.status(403).json({ message: 'Incorrect email or password' });
	    } else {
		// create a jwt token and end it in the cookies
		const jwt = await helpers.loginToken(user);
		// set the token in the cookies
		res.status(200).json({ token: jwt });
	    }
	});
    } catch (err) {
	res.status(400).send({ message: err });
    }
});


/** @openapi
* /users/login:
*       post:
*          description: Delet the user record in the database.
*          parameters:
*              - in: header
*                securityScemes:
*                  BearerAuth:
*                    type: http
*                    scheme: bearer
*          responses:
*              200:
*                description: User is created logged into the system.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.delete('/:u_id', async (req, res) => {
    // add check that user is logged in
    // token included in http-only cookies
    const token = req.get('Authorization').split(' ')[1].trim();
    const data = await helpers.loggedIn(token);
    
    if (data.loggedIn) {
	try{
	    const removed = await User.remove({ _id: data.user._id});
	    res.status(200).json({ message: 'Success' });
	} catch (err) {
	    res.json({message: err});
	}
    } else {
	res.status(403).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
