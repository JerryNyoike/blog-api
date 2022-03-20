const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // use bodyparser to parse json body
app.use(cookieParser()); //parse cookies

// Routing
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const commentsRoute = require('./routes/comments');

// swagger js doc setup
const swaggerOpt = {
    definition: {
	openapi: '3.0.0',
	info: {
	    title: 'Porty API Documentation',
	    version: '1.0.0',
	},
    },
    apis: ['./routes/*.js'],
}

const openapiSpecification = swaggerJsDoc(swaggerOpt);

// can add routes as if they were middleware
app.use('/posts', postsRoute);
app.use('/users', usersRoute);
app.use('/comments', commentsRoute);
app.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpecification))



// database connection
mongoose.connect(process.env.DB_URL, {useNewURLParser: true}, () => {
    console.log('connected to DB!');
});


// start server
app.listen(process.env.PORT);
