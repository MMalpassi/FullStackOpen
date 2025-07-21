require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contact')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.use((error, request, response, next) => {
  console.error(error.message)
  response.status(500).json({ error: 'Internal server error' })
})


app.get('/api/info', (request, response) => {
  const hour = new Date()

  Contact.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${hour}</p>
    `)
  })
})

app.get('/api/phonebook', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/phonebook/:id', (request, response) => {
  Contact.findById(request.params.id).then(phonebook_contact => {
    response.json(phonebook_contact)
  })
})

app.delete('/api/phonebook/:id', (request, response) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/phonebook', (request, response, next) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'Number or name missing' 
    });
  }

  const phonebook_contact = new Contact({
    name: body.name,
    number: body.number
  });

  phonebook_contact.save()
    .then(savedContact => {
      response.json(savedContact);
    })
    .catch(error => next(error));
});


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})