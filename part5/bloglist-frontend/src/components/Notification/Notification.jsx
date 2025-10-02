import './Notification.css'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) return null

  const { message, type } = notification
  const className =
    type === 'error' ? 'alert alert-danger' : 'alert alert-success'

  return (
    <div className={className} role="alert">
      {message}
    </div>
  )
}

export default Notification
