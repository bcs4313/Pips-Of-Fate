import { createContext, useRef, useContext } from "react"
import { UIBus } from "./uiBus.js"

export const uiBusContext = createContext(null)

export function UIBusProvider({ children })
{
    const busRef = useRef(new UIBus())  // this should never be made more than once of course

    return (
        <uiBusContext.Provider value={ busRef.current }>
            { children }
        </uiBusContext.Provider>
    )
}

export function useUIBus() {
    const UIBus = useContext(uiBusContext)

    if(!UIBus)
    {
        throw new Error("useUIBus must be used inside UIBusProvider")
    }

    return UIBus
}