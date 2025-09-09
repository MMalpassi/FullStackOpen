import { useState } from "react"

const LoginForm = ({submitLogin}) => {
  const [newUsername, setUsername] = useState('')
  const [newPassword, setPassword] = useState('')

  const newLogin = (event) => {
    event.preventDefault()
    submitLogin({
      username: newUsername,
      password: newPassword
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login to application</h2>
      <form onSubmit={newLogin}>
        <div>
          Username:
          <input
          type="text"
          value={newUsername}
          name="Username"
          onChange={event => setUsername(event.target.value)}
          >
          </input>
        </div>
        <div>
          Password
          <input
            type="text"
            value={newPassword}
            name="Password"
            onChange={event => setPassword(event.target.value)} 
          >
          </input>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm