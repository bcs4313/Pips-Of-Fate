import { createContext, useContext } from "react"
import useInventoryLink from "./../items/UseInventory"

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
    const inventory = useInventoryLink()

    return (
        <InventoryContext.Provider value={inventory}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory() {
    const inventory = useContext(InventoryContext)

    if (!inventory) {
        throw new Error("useInventory must be used inside InventoryProvider")
    }

    return inventory
}8