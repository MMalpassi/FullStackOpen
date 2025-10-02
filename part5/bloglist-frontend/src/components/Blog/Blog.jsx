import './Blog.css'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div className="card my-2">
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
            {blog.title}
          </Link>
        </h5>
        <p className="card-text text-muted">by {blog.author}</p>
      </div>
    </div>
  )
}

export default Blog
