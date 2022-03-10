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
    user_id: {
	type: mongoose.ObjectId,
	required: true
    }
});


module.exports = mongoose.model('Posts', PostSchema);
