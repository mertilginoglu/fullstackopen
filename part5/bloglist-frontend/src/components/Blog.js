import { useState } from "react"

const Blog = ({blog, addLike}) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
  <div style={blogStyle}>
    <div>
      <p>{blog.title} {blog.author}</p>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>view</button>
      </div>
    </div>
    <div style={showWhenVisible}>
      <label>{likes} 
        <button onClick={addLike}>
          like
        </button>
      </label>
      <p>{blog.url}</p>
      <button onClick={toggleVisibility}>hide</button>
    </div>
  </div>
  ) 
}

export default Blog