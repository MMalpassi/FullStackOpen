import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, ListGroup } from 'react-bootstrap'
import './UserDetails.css'

const UserDetails = () => {
  const id = useParams().id
  const users = useSelector((state) => state.userList)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return <p>User not found...</p>
  }

  return (
    <div className="user-detail-container">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">{user.name}</Card.Title>
          <h5 className="mb-3">Added Blogs</h5>
          {user.blogs.length > 0 ? (
            <ListGroup variant="flush" className="user-blogs">
              {user.blogs.map((blog) => (
                <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">This user has not added any blogs yet.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default UserDetails
