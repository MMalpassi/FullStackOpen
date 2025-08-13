import './Notification.css'

const Notification = ({ message, error }) => {
  if (!message && !error) return null

  const className = error ? 'error' : 'success'

  return (
    <div className={className}>
      {message || error}
    </div>
  )
}

export default Notification