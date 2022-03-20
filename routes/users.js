const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jose');
const helpers = require('./helpers.js');

const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try{
	const users = await User.find();
	res.json(users);
    } catch (err) {
	res.json({ message: err });
    }
});

router.get('/:u_id', async (req, res) => {
    try{
	const user = await User.findById(u_id);
	res.status(200).json(user);
    } catch(err) {
	res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const body = req.body;

    if (!body.username || !body.email || !body.password)
	res.status(400).json({ message: 'Invalid data' });
    
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
	res.status(400).json({ message: savedPosts });
    }
});

router.post('/login', async (req, res) => {
    const body = req.body;
    try {
	const user = await User.findOne({ username: body.username });

	await bcrypt.compare(body.password, user.password, async (err, result) => {
	    if (err || !result) {
		res.status(403).json({ message: 'Incorrect email or password' });
	    } else {
		// create a jwt token and end it in the cookies
		const jwt = await helpers.loginToken(user);
		// set the token in the cookies
		res.cookie('token', jwt, { httpOnly: true });
		res.status(200).json({ user: user.email });
	    }
	});
    } catch (err) {
	res.status(400).send({ message: err });
    }
});

router.delete('/:u_id', async (req, res) => {
    // add check that user is logged in
    // token included in http-only cookies
    const token = req.cookies.token;
    const { loggedIn, u_id } = helpers.loggedIn(token);

    if (loggedIn) {
	try{
	    const removed = User.remove({ _id: u_id});
	    res.status(200).json({ message: 'Success' });
	} catch (err) {
	    res.json({message: err});
	}
    } else {
	res.status(403).json({ message: 'Unauthorized' });
    }
});

module.exports = router;