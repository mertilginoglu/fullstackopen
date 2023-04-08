const express = require('express');

const app = express();
const cors = require('cors');
require('express-async-errors')
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');


app.use(cors());
app.use(express.json());
app.use('/api/blogs/', blogsRouter);
app.use('/api/users/', usersRouter);


module.exports = app