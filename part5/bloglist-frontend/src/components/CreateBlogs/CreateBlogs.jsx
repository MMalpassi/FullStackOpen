const CreateBlog = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        Title:
        <input value={props.title} onChange={props.handleTitleChange} />
      </div>
      <div>
        Author:
        <input value={props.author} onChange={props.handleAuthorChange} />
      </div>
      <div>
        URL:
        <input value={props.url} onChange={props.handleUrlChange} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
