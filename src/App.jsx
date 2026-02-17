import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import { useState } from 'react'
import './App.css'
import Header from './components/main_layout/Header'
import WebsiteMain from './components/main_layout/WebsiteMain'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <WebsiteMain/>
    </>
  )
}

export default App
