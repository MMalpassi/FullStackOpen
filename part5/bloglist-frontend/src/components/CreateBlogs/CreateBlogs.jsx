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
          <input name="Title" value={newTitle} onChange={e => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Author:
          <input name="Author" value={newAuthor} onChange={e => setAuthor(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          URL:
          <input name="URL" value={newUrl} onChange={e => setUrl(e.target.value)} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
