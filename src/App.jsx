import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import { useState } from 'react'
import './App.css'
import Header from './components/main_layout/Header'
import WebsiteMain from './components/main_layout/WebsiteMain'
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<WebsiteMain/>}/>
      </Routes>
    </>
  )
}

export default App
