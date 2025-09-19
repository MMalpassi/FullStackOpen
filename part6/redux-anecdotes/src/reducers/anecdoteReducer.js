import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const updated = action.payload
      return state.map(a =>
        a.id !== updated.id ? a : updated
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action){ 
      return action.payload
    }
  },
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const newVoteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.newVote(anecdote)
    dispatch(anecdoteSlice.actions.voteAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer