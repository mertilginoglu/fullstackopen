const mongoose = require('mongoose');
const config = require('../utils/config');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Blog', blogSchema);
