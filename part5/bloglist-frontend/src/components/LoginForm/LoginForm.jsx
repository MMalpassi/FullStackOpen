  const LoginForm = (props) => {
    return (
      <div>
        <h2>Login to application</h2>
        <form onSubmit={props.handleLogin}>
          <div>
            Username:
            <input
            type="text"
            value={props.username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            >
            </input>
          </div>
          <div>
            Password
            <input
              type="text"
              value={props.password}
              name="Password"
              onChange={({target}) => setPassword(target.value)} 
            >
            </input>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

export default LoginForm