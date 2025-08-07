const { test, describe, beforeEach, after} = require('node:test')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const listHelper = require('../utils/list_helper')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'MMalpassi',
      name: 'Mateo Malpassi',
      password: 'Argentina',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails if username is missing', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      name: 'No Username',
      password: 'No Username',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /username.*required/i)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if password is missing', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'No Password',
      name: 'No Password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /password.*at least 3 characters/i)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()
    console.log('usersAtStart:', usersAtStart.length)

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.match(response.body.error, /username.*unique/i)

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if username is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'As',
      name: 'Short Username',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /username.*minimum allowed length/i)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if password is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
    console.log('usersAtStart:', usersAtStart.length)

    const newUser = {
      username: 'MMalpassi',
      name: 'Short Password',
      password: '12',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /password.*at least 3 characters/i)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})