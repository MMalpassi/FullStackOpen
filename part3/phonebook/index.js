const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors())

app.use(express.static('dist'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    } 
]

app.get('/api/phonebook', (request, response) => {
  response.json(phonebook)
})

app.get('/api/info', (request,response) => {
  const hour = new Date();

  response.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${hour}</p>
  `)
})

app.get('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  const phonebook_contacts = phonebook.find(phonebook => phonebook.id === id)

  if (phonebook_contacts) {
    response.json(phonebook_contacts)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(phonebook_contact => phonebook_contact.id !== id)

  response.status(204).end()
})

app.use(express.json())

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post('/api/phonebook', (request, response) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'number or name missing' 
    })
  }

  const nameRepeated = phonebook.some(phonebook_contact => phonebook_contact.name === body.name);
  if (nameRepeated) {
    return response.status(400).json({
      error: 'El nombre ya existe en la agenda'
    });
  }

  const phonebook_contact = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(phonebook_contact)

  response.json(phonebook_contact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})