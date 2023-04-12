import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("in here")
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage("Added a blog")
        setTimeout(() => setSuccessMessage(null), 5000)
      }).catch((err) => {
        setErrorMessage(err.message)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const updatedBlog = await blogService.update(blogToUpdate)
    setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
  }

  const deleteBlog = async (blog) => {
    console.log(blog)
    await blogService.deleteBlog(blog.id)
    console.log("in here")
    setBlogs(blogs.filter(b => b.id !== blog.id ))
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      {errorMessage && 
      <label> {errorMessage} </label>
      }
      <h2>blogs</h2>
      {!user && 
        <Togglable buttonLabel="Log in">
          <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
          />
        </Togglable>
      }
      
      {user &&
        <div>
          {user.name} logged in <button onClick={handleLogout}>Logout</button>
          <Togglable buttonLabel="create new blog">
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          {blogs.sort(byLikes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            deleteBlog={() => deleteBlog(blog)}
            canRemove = {user && blog.user.username===user.username}
          />
        )}
        </div>
      }

    </div>
  )
}

export default App