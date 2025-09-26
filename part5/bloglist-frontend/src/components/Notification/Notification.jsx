import './Notification.css'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) return null

  const { message, type } = notification
  const className = type === 'error' ? 'error' : 'success'

  return <div className={className}>{message}</div>
}

export default Notification
