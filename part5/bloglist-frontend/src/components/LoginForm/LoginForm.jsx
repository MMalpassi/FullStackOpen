  const LoginForm = (props) => {
    return (
      <div>
        <h2>Login to application</h2>
        <form onSubmit={props.handleSubmit}>
          <div>
            Username:
            <input
            type="text"
            value={props.username}
            name="Username"
            onChange={props.handleUsernameChange}
            >
            </input>
          </div>
          <div>
            Password
            <input
              type="text"
              value={props.password}
              name="Password"
              onChange={props.handlePasswordChange} 
            >
            </input>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

export default LoginForm