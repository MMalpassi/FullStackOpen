import './Blog.css'

const Blog = ({ blog, isVisible, toggleVisibility, handleLike, handleRemove }) => {
  return (
    <div className='blog-container'>
      <p>{blog.title}</p>

      {!isVisible ? (
        <button onClick={toggleVisibility}>
          View info about {blog.title}
        </button>
      ) : (
        <div>
          <p>Author: {blog.author}</p>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button onClick={() => handleLike(blog)}>Like</button>
          </p>
          <p>
            <button onClick={() => handleRemove(blog)}>Remove</button>
          </p>
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      )}
    </div>
  )
}

export default Blog