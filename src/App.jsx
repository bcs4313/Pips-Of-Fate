import './styles/custom-bootstrap.scss'; // custom reactstrap color palette
import './App.css'
import Header from './components/main_layout/Header'
import WebsiteMain from './components/main_layout/WebsiteMain'
import Store from "./components/store/Store"
import GameSettings from "./components/settings/GameSettings.jsx"
import { Routes, Route } from "react-router-dom"
import { EngineProvider } from "./components/internal_state/EngineContextProvider.jsx"
import { InventoryProvider } from "./components/items/InventoryContextProvider.jsx"
import { UIBusProvider } from "./components/vfx/UIBusContextProvider.jsx"
import { SoundProvider } from "./utilities/soundManagerProvider.jsx"

function App() {
  return (
    <>
      <SoundProvider>
      <UIBusProvider>
        <InventoryProvider>
          <EngineProvider>
              <Header/>
              <Routes>
                <Route path="/" element={<WebsiteMain/>}/>
                <Route path="/store" element={<Store/>}/>
                <Route path="/settings" element={<GameSettings/>}/>
              </Routes>
          </EngineProvider>
        </InventoryProvider>
      </UIBusProvider>
      </SoundProvider>
    </>
  )
}

export default App
