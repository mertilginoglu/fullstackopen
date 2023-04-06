const express = require('express');

const app = express();
const cors = require('cors');
require('express-async-errors')
const blogsRouter = require('./controllers/blogs');

app.use(cors());
app.use(express.json());
app.use('/api/blogs/', blogsRouter);

module.exports = app