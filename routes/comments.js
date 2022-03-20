const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const helpers = require('./helpers');

const router = express.Router();


/** @openapi
* /comments/all/{post_id}:
*       post:
*          description: Login a registered user.
*          parameters:
*              - in: path
*                name: post_id
*                required: true
*                schema:
*                  type: string
*          responses:
*              200:
*                description: The list of comments for the post is returned.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.get('/all/:post_id', async (req, res) => {
    try {
	console.log('jwoeiureewrk');
	const comments = await Comment.find({post_id: mongoose.Types.ObjectId(req.params.post_id)}, '_id user_id post_id content');
	res.status(200).json(comments);
    } catch (err) {
	res.status(500).json({ message: err });
    }    
});

/** @openapi
* /comments/{comment_id}:
*       post:
*          description: Login a registered user.
*          parameters:
*              - in: header
*                name: comment_id
*                schema:
*                  type: string
*                  required: true
*          responses:
*              200:
*                description: The comment is returned.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
router.get('/:comment_id', async (req, res) => {
    try {
	const comment = await Comment.findById(mongoose.Types.ObjectId(comment_id));

	res.status(200).json(comment);
    } catch (err) {
	res.status(500).json({ message: err });
    }
});


/** @openapi
* /comments:
*       post:
*          description: Login a registered user.
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
*                    post_id:
*                      description: The post on which the user is commenting.
*                      required: true
*                    content:
*                      description: The user's comment.
*                      required: true
*          responses:
*              200:
*                description: Comment is created for the post.
*              400:
*                description: The request body is malformed.
*              500:
*                description: Failure due to a server error.
*/
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
