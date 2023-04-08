const User = require('../models/user')

const initialBlogs = [
    {
        title: 'kendall is the best',
        author: 'mert',
        url: 'logan.com',
        likes: 6,
    },
    {
        title: 'lolll',
        author: 'roman',
        url: 'shiv.com',
        likes: 5,
    },
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}
  
module.exports = {
    initialBlogs,
    usersInDb
}