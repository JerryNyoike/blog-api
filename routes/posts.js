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

router.get('/specific', (req, res) => {
    res.send('We are on a specific post');
});

router.post('/', async (req, res) => {
    const post = new Post({
	title: req.body.title,
	description: req.body.description,
    });

    try {
	const savedPosts = await post.save();
	res.json(savedPosts);
    } catch (err) {
	res.json({ message: savedPosts });
    }
});

router.post('/:postId', async (req, res) => {
    try {
	const post = await Post.findById(req.params.postId);
	res.json(post);
    } catch (err) {
	res.json({message: err});
    }
});

router.delete('/:postId', async (req, res) => {
    try{
	const removed = Post.remove({ _id: req.params.postId });
	res.json();
    } catch (err) {
	res.json({message: err});
    }
});

router.delete('/:postId', async (req, res) => {
    try{
	const removed = Post.remove({ _id: req.params.postId });
	res.json(removed);
    } catch (err) {
	res.json({message: err});
    }
});

module.exports = router;
