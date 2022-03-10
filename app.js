const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Middleware
app.use(bodyParser.json()); // use bodyparser to parse json body

// Routing
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const commentsRoute = require('./routes/comments');

// can add routes as if they were middleware
app.use('/posts', postsRoute);
app.use('/users', usersRoute);
app.use('/comments', commentsRoute);

// database connection
mongoose.connect(process.env.DB_URL, {useNewURLParser: true}, () => {
    console.log('connected to DB!');
});


// start server
app.listen(process.env.PORT);
