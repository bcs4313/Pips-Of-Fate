import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import './App.css'
import Header from './components/main_layout/Header'
import WebsiteMain from './components/main_layout/WebsiteMain'
import Store from "./components/store/Store"
import { Routes, Route } from "react-router-dom"
import { EngineProvider } from "./components/internal_state/EngineContextProvider.jsx"

function App() {
  return (
    <>
      <EngineProvider>
        <Header/>
        <Routes>
          <Route path="/" element={<WebsiteMain/>}/>
          <Route path="/store" element={<Store/>}/>
        </Routes>
      </EngineProvider>
    </>
  )
}

export default App
