import { useState } from 'react'

const CreateBlog = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          Title:
          <input value={newTitle} onChange={e => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Author:
          <input value={newAuthor} onChange={e => setAuthor(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          URL:
          <input value={newUrl} onChange={e => setUrl(e.target.value)} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
