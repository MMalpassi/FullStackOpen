import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Card, Spinner } from 'react-bootstrap'

const BlogDetails = ({ handleLike, handleRemove }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const blogs = useSelector((state) => state.blogs)
  const blogMatched = blogs.find((b) => b.id === id)

  return (
    <div className="blog-detail-container mt-3">
      {!blogMatched ? (
        <div className="loading">
          <Spinner animation="border" role="status" size="sm" />
          <span className="ms-2">Blog no encontrado o cargando...</span>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>{blogMatched.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted mt-2">
              Author: {blogMatched.author}
            </Card.Subtitle>
            <Card.Text className="mb-2 text-muted mt-2">
              <strong>URL:</strong> {blogMatched.url}
            </Card.Text>
            <Card.Text className="mb-2 text-muted mt-2">
              <strong>Likes:</strong>{' '}
              <span data-testid="blog-likes">{blogMatched.likes}</span>{' '}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleLike(blogMatched)}
              >
                Like
              </Button>
            </Card.Text>
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemove(blogMatched)}
              >
                Remove
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default BlogDetails
