const express = require('express');

const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    try{
	const posts = await Post.find();
	res.json(posts);
    } catch (err) {
	res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const body = req.body;
    const token = req.cookies.token;

    const { loggedIn, u_id } = loggedIn(token);

    if (loggedIn) {
	const post = new Post({
	    title: req.body.title,
	    description: req.body.description,
	    user_id: u_id
	});

	try {
	    const savedPosts = await post.save();
	    res.json({ message: 'Success' });
	} catch (err) {
	    res.json({ message: err });
	}	
    } else {
	res.status(403).json({ message: 'Must be logged in' });
    }
});

router.get('/:postId', async (req, res) => {
    try {
	const post = await Post.findById(req.params.postId);
	res.json({ message: 'Success' });
    } catch (err) {
	res.json({message: err});
    }	
});

router.delete('/:postId', async (req, res) => {
    const body = req.body;
    const token = req.cookies.token;

    const { loggedIn, u_id } = loggedIn(token);

    if (loggedIn) {
	try{
	    const removed = Post.remove({ _id: req.params.postId });
	    res.json();
	} catch (err) {
	    res.json({message: err});
	}
    } else {
	res.status(403).json({ message: 'Must be logged in' });
    }
});

module.exports = router;
