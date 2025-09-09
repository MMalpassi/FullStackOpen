import { useState } from 'react'

const CreateBlog = ({createBlog}) => {
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
        Title:
        <input value={newTitle} onChange={event => setTitle(event.target.value)} />
      </div>
      <div>
        Author:
        <input value={newAuthor} onChange={event => setAuthor(event.target.value)} />
      </div>
      <div>
        URL:
        <input value={newUrl} onChange={event => setUrl(event.target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
