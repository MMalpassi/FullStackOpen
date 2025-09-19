import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const anecdoteObject = {content, votes:0}
  const response = await axios.post(baseUrl, anecdoteObject)
  return response.data
}

const newVote = async (anecdote) => {
  const anecdoteUpdated = {...anecdote, votes: anecdote.votes + 1}
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdoteUpdated)
  return response.data
}

export default { getAll, createNew, newVote }