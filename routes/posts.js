const express = require('express');
const helpers = require('./helpers');

const router = express.Router();
const Post = require('../models/Post');


/** @openapi
* /posts:
*       get:
*          description: Fetch all posts.
*          responses:
*              200:
*                description: All posts are returned in JSON format.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.get('/', async (req, res) => {
    try{
	const posts = await Post.find();
	res.json(posts);
    } catch (err) {
	res.json({ message: err });
    }
});


/** @openapi
* /posts:
*       post:
*          description: Allows a user to create a post.
*          parameters:
*              - in: header
*                securityScemes:
*                  BearerAuth:
*                    type: http
*                    scheme: bearer
*          requestBody:
*              content:
*                application/json:
*                  schema:
*                    title:
*                      description: The title of the post the user wants to create.
*                      type: string
*                      required: true
*                    description:
*                      description: The short description of the user's post.
*                      type: string
*                      required: true
*                    content:
*                      description: The content of the user's post.
*                      type: string
*                      required: true
*          responses:
*              200:
*                description: User's post is created.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.post('/', async (req, res) => {
    const body = req.body;
    const token = req.get('Authorization').split(' ')[1].trim();
    const { loggedIn, user } = await helpers.loggedIn(token);
    console.log(loggedIn);

    if (loggedIn) {
	const title = req.body.title.trim();
	const desc = req.body.description.trim();
	const content = req.body.content.trim();

	if (title.length == 0 || desc.length == 0 || content.length == 0) {
	    return res.status(400).json({"message": "Invalid data"});
	}
	
	const post = new Post({
	    title: title,
	    description: desc,
	    content: content,
	    user_id: user._id
	});

	try {
	    const savedPosts = await post.save();
	    res.status(200).json({ message: 'Success' });
	} catch (err) {
	    res.json({ message: err });
	}	
    } else {
	res.status(403).json({ message: 'Must be logged in' });
    }
});


/** @openapi
* /posts/{post_id}:
*       post:
*          description: Fetch a particular post.
*          parameters:
*              - in: path
*                name: post_id
*                schema:
*                    type: string
*                    required: true
*          responses:
*              200:
*                description: The post is returned in JSON format.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.get('/:postId', async (req, res) => {
    try {
	const post = await Post.findById(req.params.postId);
	res.json(post);

    } catch (err) {
	res.json({message: err});
    }	
});

/** @openapi
* /posts/{post_id}:
*       delete:
*          description: Delete a particular post.
*          parameters:
*              - in: path
*                name: post_id
*                schema:
*                    type: string
*                    required: true
*              - in: header
*                securityScemes:
*                  BearerAuth:
*                    type: http
*                    scheme: bearer
*          responses:
*              200:
*                description: The post is deleted successfully.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.delete('/:postId', async (req, res) => {
    const token = req.get('Authorization').split(' ')[1].trim();

    const { loggedIn, u_id } = await helpers.loggedIn(token);

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
