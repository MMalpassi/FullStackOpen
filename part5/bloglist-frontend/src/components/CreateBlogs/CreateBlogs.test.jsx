import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlogs'
import { expect, test, vi } from 'vitest'

test('calls createBlog with correct details when a new blog is created', async () => {
  const createBlogMock = vi.fn()

  render(<CreateBlog createBlog={createBlogMock} />)

  const user = userEvent.setup()

  const titleInput = screen.getByLabelText(/title:/i)
  const authorInput = screen.getByLabelText(/author:/i)
  const urlInput = screen.getByLabelText(/url:/i)

  const submitButton = screen.getByText(/create/i)

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testurl.com')

  await user.click(submitButton)

  expect(createBlogMock).toHaveBeenCalledTimes(1)
  expect(createBlogMock).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com'
  })
})
