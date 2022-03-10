const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: {
	type: mongoose.ObjectId,
	required: true
    },
    post_id: {
	type: mongoose.ObjectId,
	required: true
    },
    content: {
	type: String,
	required: true
    }
});

default.exports = mongoose.model('Comment', CommentSchema);
