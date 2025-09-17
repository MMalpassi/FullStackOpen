import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote} from '../reducers/anecdoteReducer'
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

    const vote = (id, content) => {
        dispatch(voteAnecdote(id))
        dispatch(showNotification(`You voted for "${content}"`, 5))
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
                        <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList