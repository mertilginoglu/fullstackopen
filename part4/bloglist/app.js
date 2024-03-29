const express = require('express');

const middleware = require('./utils/middleware')

const app = express();
const cors = require('cors');
require('express-async-errors')

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');


app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor)
app.use('/api/blogs/', blogsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
module.exports = app