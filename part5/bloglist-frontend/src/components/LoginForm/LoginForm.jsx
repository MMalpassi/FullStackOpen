import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ submitLogin }) => {
  const [newUsername, setUsername] = useState('')
  const [newPassword, setPassword] = useState('')

  const newLogin = (event) => {
    event.preventDefault()
    submitLogin({
      username: newUsername,
      password: newPassword,
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2 data-testid="Login">Login to application</h2>
      <Form onSubmit={newLogin}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={newUsername}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm
