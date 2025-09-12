import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    const newUser = {
      name: 'Tester',
      username: 'tester',
      password: '123456'
    }
    await request.post('http://localhost:3001/api/users/', { data: newUser })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const heading = page.getByText('Login to application')
    const usernameInput = page.getByLabel(/username/i)
    const passwordInput = page.getByLabel(/password/i)
    const submitButton = page.getByRole('button', { name: /login/i })

    await expect(heading).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel(/username/i).fill('tester')
      await page.getByLabel(/password/i).fill('123456')
      await page.getByRole('button', { name: /login/i }).click()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel(/username/i).fill('tester')
      await page.getByLabel(/password/i).fill('wrongPassw')
      await page.getByRole('button', { name: /login/i }).click()
      await expect(page.getByText('Tester logged-in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3001/api/testing/reset')
      const newUser = {
        name: 'Tester',
        username: 'tester',
        password: '123456'
      }
      await request.post('http://localhost:3001/api/users/', { data: newUser })
      await page.goto('http://localhost:5173')
      await page.getByLabel(/username/i).fill('tester')
      await page.getByLabel(/password/i).fill('123456')
      await page.getByRole('button', { name: /login/i }).click()
      await expect(page.getByText('Tester logged-in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      const newBlogButton = page.getByRole('button', { name: /new blog/i })
      await expect(newBlogButton).toBeVisible()
      await newBlogButton.click()

      await page.getByLabel('Title:').fill('Test blog')
      await page.getByLabel('Author:').fill('Tester')
      await page.getByLabel('URL:').fill('https://test.com')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Test blog by Tester')).toBeVisible()
    })
  })
})
