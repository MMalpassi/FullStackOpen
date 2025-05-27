import { useState, useRef } from 'react'

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
          <p key={person.id}>{person.name} {person.number}</p>
        ))
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const idRef = useRef(0)

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
      id: idRef.current
    }
    const nameRepeated = persons.find((person) => person.name === newName)
    {nameRepeated ? 
      alert(`${newName} is already added to phonebook`) : 
      setPersons(persons.concat(personObject))
      idRef.current++
      setNewName('')
      setNewNumber('')
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
      <Filter filter={filterName} property={handleFilter}/>
      <h2>Add a new contact!</h2>
      <PersonForm property={addPerson} personName={newName} propertyPersonName={handleNewName} personNumber={newNumber} propertyPersonNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterName}/>
    </div>
  )
}

export default App
