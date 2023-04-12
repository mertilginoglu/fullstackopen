import { useState } from 'react'

const Blog = ({ blog, like, deleteBlog, canRemove }) => {
  const [visible, setVisible] = useState(false)

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={style} className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'show'}
      </button>
      {visible&&
        <div>
          <div> <a href={blog.url}> {blog.url}</a> </div>
          <div>likes {blog.likes} <button onClick={like}>like</button></div>
          <div>{blog.user && blog.user.name}</div>
          {canRemove && <div><button onClick={deleteBlog}>delete</button></div>}
        </div>
      }
    </div>
  )
}

export default Blog