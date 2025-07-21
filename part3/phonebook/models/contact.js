const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to the url')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  
const numberValidator = [
  {
    validator: function(v) {
      if (!v || v.length < 8) return false

      const parts = v.split('-')
      if (parts.length !== 2) return false

      const [first, second] = parts

      if (!/^\d{2,3}$/.test(first)) return false

      if (!/^\d+$/.test(second)) return false

      return true
    },
    message: props => `${props.value} is not a valid phone number!`
  }
]

const phonebookSchema = new mongoose.Schema({
  name:{
    type: String,
    minLength: 3,
    requiere: true
  },
  number: {
    type: String,
    validate: numberValidator,
    requiere: true
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', phonebookSchema)