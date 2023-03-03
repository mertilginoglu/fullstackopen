import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Header = ({text}) => (
  <h1>{text}</h1>
)

const StatisticsLine = ({text, value}) => {
  if (text === "positive") {
    return(
    <tr>
      <td>{text}</td>
      <td>{value}%</td>
    </tr>
    )
    } else {  
    return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )}
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = 100 * good / all

  if(all === 0){
    return (
      <p>
        No feedback given
      </p>
    )
  } else {
    return (
      <table>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={positive} />
      </table>
      )
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleIncrementGood = () => setGood(good + 1)
  const handleIncrementNeutral = () => setNeutral(neutral + 1)
  const handleIncrementBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text="give feedback" />
      <Button text="good" handleClick = {handleIncrementGood} />
      <Button text="neutral" handleClick = {handleIncrementNeutral} />
      <Button text="bad" handleClick = {handleIncrementBad} />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App