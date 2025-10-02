import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const CreateBlog = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <Form onSubmit={addBlog}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            value={newTitle}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="author">
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            value={newAuthor}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="url">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            value={newUrl}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter blog URL"
          />
        </Form.Group>

        <Button variant="outline-primary" size="sm" type="submit">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default CreateBlog
