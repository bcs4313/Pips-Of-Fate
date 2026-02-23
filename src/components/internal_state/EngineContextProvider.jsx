import { createContext, useContext } from "react"
import { useGameEngine } from "./GameEngine.jsx"

const EngineContext = createContext(null)

export function EngineProvider({ children }) {
    const engine = useGameEngine()

    return (
        <EngineContext.Provider value={engine}>
            {children}
        </EngineContext.Provider>
    )
}

export function useEngine() {
    const engine = useContext(EngineContext)

    if (!engine) {
        throw new Error("useEngine must be used inside EngineProvider")
    }

    return engine
}