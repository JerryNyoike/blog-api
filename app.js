const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Middleware
app.use(bodyParser.json()); // use bodyparser to parse json body

// Routing
const postsRoute = require('./routes/posts');

// can add routes as if they were middleware
app.use('/posts', postsRoute);

// database connection
mongoose.connect(process.env.DB_URL, {useNewURLParser: true}, () => {
    console.log('connected to DB!');
});

// Routes
app.get('/', (req, res) => {
    res.send("This is home");
});

// start server
app.listen(process.env.PORT);
