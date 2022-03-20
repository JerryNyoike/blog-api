const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const helpers = require('./helpers');

const router = express.Router();

router.get('/all/:post_id', async (req, res) => {
    try {
	console.log('jwoeiureewrk');
	const comments = await Comment.find({post_id: mongoose.Types.ObjectId(req.params.post_id)}, '_id user_id post_id content');

	res.status(200).json(comments);
    } catch (err) {
	console.log("motherfucker");
	res.status(500).json({ message: err });
    }    
});

router.get('/:comment_id', async (req, res) => {
    try {
	const comment = await Comment.findById(mongoose.Types.ObjectId(comment_id));

	res.status(200).json(comment);
    } catch (err) {
	res.status(500).json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const body = req.body;
    const token = req.get('Authorization').split(' ')[1].trim();

    const { loggedIn, user } = await helpers.loggedIn(token);

    if (loggedIn) {
	try {
	    const comment = new Comment({
		user_id: user._id,
		post_id: mongoose.Types.ObjectId(body.post),
		content: body.content
	    });
	    
	    await comment.save();
	    res.status(200).json({ message: 'Success' });
	} catch (err) {
	    res.status(400).json({ message: err });
	}
    } else {
	res.status().json({ message: 'Must be logged in' });
    }
});


module.exports = router;
