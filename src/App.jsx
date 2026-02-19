import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import './App.css'
import Header from './components/main_layout/Header'
import WebsiteMain from './components/main_layout/WebsiteMain'
import Store from "./components/store/Store"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<WebsiteMain/>}/>
        <Route path="/store" element={<Store/>}/>
      </Routes>
    </>
  )
}

export default App
