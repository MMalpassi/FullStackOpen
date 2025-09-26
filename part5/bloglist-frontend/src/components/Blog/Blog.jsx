import './Blog.css'

const Blog = ({
  blog,
  isVisible,
  toggleVisibility,
  handleLike,
  handleRemove,
}) => {
  return (
    <div className="blog-container">
      <p className="blog-basic" data-testid="blog-basic">
        {blog.title} by {blog.author}
      </p>

      {!isVisible ? (
        <button onClick={toggleVisibility}>View info about</button>
      ) : (
        <div>
          <p data-testid="blog-author">Author: {blog.author}</p>
          <p data-testid="blog-url">URL: {blog.url}</p>
          <p>
            Likes: <span data-testid="blog-likes">{blog.likes}</span>{' '}
            <button onClick={() => handleLike(blog)}>Like</button>
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
