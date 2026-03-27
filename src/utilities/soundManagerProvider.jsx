import { createContext, useContext } from "react"
import { useSoundManager } from "./soundManager"

const SoundContext = createContext(null)

export function SoundProvider({ children }) {
    const sm = useSoundManager()

    return (
        <SoundContext.Provider value={sm}>
            {children}
        </SoundContext.Provider>
    )
}

export function useSoundChannel() {
    const sc  = useContext(SoundContext)

    if (!sc) {
        throw new Error("useSoundChannel must be used inside soundManagerProvider")
    }

    return sc
}8