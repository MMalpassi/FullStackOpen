import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Filter = (props) => {
  return (
    <div>
        Filter shown with <input value={props.filter} onChange={props.property}/>
    </div>
  )
} 

const PersonForm = (props) => {
  return (
    <form onSubmit={props.property}>
        <div>
          Name: <input value={props.personName} onChange={props.propertyPersonName}/>
        </div>
        <div>
          Number: <input value={props.personNumber} onChange={props.propertyPersonNumber}/>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
  )
}

const Persons = (props) => {
  return(
    <div>
      {props.persons
        .filter(person => person.name.toLowerCase().includes((props.filter).toLowerCase()))
        .map(person => (
          <p key={person.id}>{person.name} {person.number}
             <button onClick={() => props.property(person.id)}>Delete</button>
          </p>
        ))
      }
    </div>
  )
}

const Notification = ({ message, error }) => {
  if (!message && !error) return null

  const className = error ? 'error' : 'success'

  return (
    <div className={className}>
      {message || error}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const isValidPhoneNumber = (number) => {
      if (number.length < 8) return false

      const parts = number.split('-')
      if (parts.length !== 2) return false

      const [first, second] = parts

      if (!/^\d{2,3}$/.test(first)) return false
      if (!/^\d+$/.test(second)) return false

      return true
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (newName.length < 3 || newNumber.length === 0) {
      setErrorMessage("The name must be at least 3 characters long and the number cannot be undefined")
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    if (!isValidPhoneNumber(newNumber)) {
      setErrorMessage("Invalid phone number format. It should be XX-XXXXXXX or XXX-XXXXXXX.")
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    const nameRepeated = persons.find(person => person.name === newName)
    if (nameRepeated) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...nameRepeated, number: newNumber }
        phonebookService
        .update(nameRepeated.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== nameRepeated.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Updated '${returnedPerson.name}'`)
          setTimeout(() => setSuccessMessage(null), 5000)
        })
        .catch(error => {
          console.error('Error updating person:', error)
          setErrorMessage(
              `Error while updating`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
      }
    } else {
      phonebookService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      setSuccessMessage(
          `Added '${newName}'`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} number?`)) {
      phonebookService
      .deleteObject(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        console.error('Error deleting person:', error)
        setErrorMessage(
            `Error deleting'${newName}'`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
      })
    }
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} error={errorMessage}/>
      <Filter filter={filterName} property={handleFilter}/>
      <h2>Add a new contact!</h2>
      <PersonForm property={addPerson} personName={newName} propertyPersonName={handleNewName} personNumber={newNumber} propertyPersonNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterName} property={deletePerson}/>
    </div>
  )
}

export default App
