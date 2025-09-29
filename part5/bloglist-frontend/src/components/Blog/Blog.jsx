import './Blog.css'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div className="blog-container">
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  )
}

export default Blog
