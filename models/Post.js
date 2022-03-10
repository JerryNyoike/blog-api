const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
	type: String,
	required: true,
    },
    description: {
	type: String,
	required: true
    },
    date: {
	type: Date,
	default: Date.now,
	required: true,
    },
    user_id: mongoose.ObjectId
});


module.exports = mongoose.model('Posts', PostSchema);
