const express = require('express');
const Comment = require('../models/Comment');
const helpers = require('./helpers');

const router = express.Router();

router.get('/all/:post_id', async (req, res) => {
    try {
	const comments = await Comment.find({ post_id: post_id });

	res.status(200).json(comments);
    } catch (err) {
	res.status(500).json({ message: err });
    }    
});

router.get('/:comment_id', async (req, res) => {
    try {
	const comment = await Comment.findById(comment_id);

	res.status(200).json(comment);
    } catch (err) {
	res.status(500).json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const body = req.body;
    const token = req.cookies.token;

    const { loggedIn, u_id } = loggedIn(token);

    if (loggedIn) {
	try {
	    const comment = new Comment({
		user_id: u_id,
		post_id: body.post,
		content: post.content
	    });

	    res.status(200).json({ message: 'Success' });
	} catch (err) {
	    res.status(400).json({ message: err });
	}
    } else {
	res.status().json({ message: 'Must be logged in' });
    }
});


module.exports = router;
