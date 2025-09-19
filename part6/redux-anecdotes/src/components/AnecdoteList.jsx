import { useSelector, useDispatch } from 'react-redux'
import { newVoteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '' || state.filter === 'ALL') {
        return state.anecdotes
        }
        return state.anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    })
    
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(newVoteAnecdote(anecdote))
        dispatch(showNotification(`You voted for "${anecdote.content}"`, 5))
    }

    const sortedAnecdotes = [...anecdotes].sort((anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList