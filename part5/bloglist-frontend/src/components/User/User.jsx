import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setListUsers } from '../../reducers/listUserReducers'
import userService from '../../services/users'
import { Link } from 'react-router-dom'

const User = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.userList)

  useEffect(() => {
    userService.getAll().then((users) => dispatch(setListUsers(users)))
  }, [dispatch])

  return (
    <div>
      {users ? (
        <>
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Blogs created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  )
}

export default User
