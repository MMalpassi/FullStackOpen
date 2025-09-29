import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BlogDetails = ({ handleLike, handleRemove }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const blogs = useSelector((state) => state.blogs)
  const blogMatched = blogs.find((b) => b.id === id)

  return (
    <div>
      {!blogMatched ? (
        <p>Blog no encontrado o cargando...</p>
      ) : (
        <>
          <div>
            <h2>{blogMatched.title}</h2>
            <p data-testid="blog-author">Author: {blogMatched.author}</p>
            <p data-testid="blog-url">URL: {blogMatched.url}</p>
            <p>
              Likes: <span data-testid="blog-likes">{blogMatched.likes}</span>{' '}
              <button onClick={() => handleLike(blogMatched)}>Like</button>
            </p>
            <p>
              <button onClick={() => handleRemove(blogMatched)}>Remove</button>
            </p>
            <button onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </>
      )}
    </div>
  )
}

export default BlogDetails
