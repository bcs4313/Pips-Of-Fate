import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import { useState } from 'react'
import './App.css'
import Header from './components/main_layout/Header'
import DiceBoard from './components/dice_view/DiceBoard/DiceBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <DiceBoard />
    </>
  )
}

export default App
