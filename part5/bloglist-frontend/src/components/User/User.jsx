import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setListUsers } from '../../reducers/listUserReducers'
import userService from '../../services/users'
import { Link } from 'react-router-dom'
import { Spinner, Table } from 'react-bootstrap'
import './User.css'

const User = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.userList)

  useEffect(() => {
    userService.getAll().then((users) => dispatch(setListUsers(users)))
  }, [dispatch])

  return (
    <div className="users-container">
      {users ? (
        <>
          <h2 className="mb-3">Users</h2>
          <Table striped bordered hover responsive className="users-table">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Blogs created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`} className="user-link">
                      {user.name}
                    </Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div className="loading">
          <Spinner animation="border" role="status" size="sm" />
          <span className="ms-2">Loading users...</span>
        </div>
      )}
    </div>
  )
}

export default User
