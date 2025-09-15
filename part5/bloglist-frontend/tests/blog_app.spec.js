import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    // Resetear DB y crear usuario
    await request.post('http://localhost:3001/api/testing/reset')
    const newUser = {
      name: 'Tester',
      username: 'tester',
      password: '123456'
    }
    await request.post('http://localhost:3001/api/users/', { data: newUser })
    await page.goto('http://localhost:5173')
  })

  test.describe('When logged in', () => {
    test('Login - Create blog - Liked (edited) - Delete', async ({ page }) => {
      //Logged-in test
      await page.getByLabel(/username/i).fill('tester')
      await page.getByLabel(/password/i).fill('123456')
      await page.getByRole('button', { name: /login/i }).click()
      await expect(page.getByText(/Tester logged-in/)).toBeVisible()

      //Create blog test
      const newBlogButton = page.getByRole('button', { name: /new blog/i })
      await newBlogButton.click()
      await page.getByLabel('Title:').fill('Blog to like')
      await page.getByLabel('Author:').fill('Tester')
      await page.getByLabel('URL:').fill('https://test.com')
      await page.getByRole('button', { name: /create/i }).click()

      //Like blog test
      const blogBasic = page.getByTestId('blog-basic')
      await expect(blogBasic).toBeVisible()
      await expect(blogBasic).toHaveText('Blog to like by Tester')

      const viewButton = page.getByRole('button', { name: /view info about/i })
      await viewButton.click()

      const likesSpan = page.getByTestId('blog-likes')
      const likeButton = page.getByRole('button', { name: /like/i })

      await expect(likesSpan).toHaveText('0')
      await likeButton.click()
      await expect(likesSpan).toHaveText('1')
      await likeButton.click()
      await expect(likesSpan).toHaveText('2')

      //Delete the blog
      page.on('dialog', dialog => dialog.accept())
      const deleteButton = page.getByRole('button', { name: /remove/i })
      await deleteButton.click()
      await expect(page.getByText('Blog to like by Tester')).toHaveCount(0)
    })
  })
})
