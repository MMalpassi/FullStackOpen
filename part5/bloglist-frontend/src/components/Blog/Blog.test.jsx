import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders title and author by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'testAuthor',
    url: 'www.test.com',
    likes: 0
  }

  render(
    <Blog
      blog={blog}
      isVisible={false}
      toggleVisibility={() => {}}
      handleLike={() => {}}
      handleRemove={() => {}}
    />
  )

  const blogBasic = screen.getByTestId('blog-basic')
  expect(blogBasic).toHaveTextContent('Component testing is done with react-testing-library by testAuthor')

  expect(screen.queryByTestId('blog-url')).not.toBeInTheDocument()
  expect(screen.queryByTestId('blog-likes')).not.toBeInTheDocument()
})

test('render url and likes when isVisible is true', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'testAuthor',
    url: 'www.test.com',
    likes: 0
  }

  render(
    <Blog
      blog={blog}
      isVisible={true}
      toggleVisibility={() => {}}
      handleLike={() => {}}
      handleRemove={() => {}}
    />
  )

  const blogBasic = screen.getByTestId('blog-basic')
  expect(blogBasic).toHaveTextContent('Component testing is done with react-testing-library by testAuthor')
  expect(screen.getByTestId('blog-url')).toBeInTheDocument()
  expect(screen.getByTestId('blog-likes')).toBeInTheDocument()
})

test('render twice likes, twice handlers', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'testAuthor',
    url: 'www.test.com',
    likes: 0
  }

  const handleLikeMock  = vi.fn()

  render(
    <Blog
      blog={blog}
      isVisible={true}
      toggleVisibility={() => {}}
      handleLike={handleLikeMock}
      handleRemove={() => {}}
    />
  )

  const user = userEvent.setup()
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLikeMock.mock.calls).toHaveLength(2)
})
