import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handle}>{props.name}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <p>{props.text} {props.value}</p>
  )
} 

const Statistics = (props) => {
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <thead>
        </thead>
        <tbody>
          <tr>
            <td><StatisticLine text="Good" value={props.good}/></td>
          </tr>
          <tr>
            <td><StatisticLine text="Neutral" value={props.neutral}/></td>
          </tr>
          <tr>
            <td><StatisticLine text="Bad" value={props.bad}/></td>
          </tr>
          <tr>
            <td><StatisticLine text="Total" value={props.all}/></td>
          </tr>
          <tr>
            <td><StatisticLine text="Average" value={props.average}/></td>
          </tr>
          <tr>
            <td><StatisticLine text="Positive" value={props.positive}/></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => {
    setGood(good + 1);
  }
  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
  }
  const handleClickBad = () => {
    setBad(bad + 1);
  }

  let totalClicks = good + bad + neutral;
  let average = (good - bad) / totalClicks
  let positive = (good / totalClicks) * 100

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handle={handleClickGood} name="Good"/>
      <Button handle={handleClickNeutral} name="Neutral"/>
      <Button handle={handleClickBad} name="Bad"/>
      <h1>Give feedback</h1>
      {totalClicks>0 ? <Statistics good={good} neutral={neutral} bad={bad} all={totalClicks} average={average} positive={positive}/> : <p>No feedback given</p>}
    </div>
  )
}

export default App