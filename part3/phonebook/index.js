require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

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

app.get('/api/phonebook/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(phonebook_contact => {
    if(phonebook_contact){
      response.json(phonebook_contact)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/phonebook/:id', (request, response, next) => {
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

app.put('/api/phonebook/:id', (request, response, next) => {
  const body = request.body

  const phonebook_contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, phonebook_contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})