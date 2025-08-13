import { useState } from 'react'

const CreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title:
        <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        Author:
        <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        URL:
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
