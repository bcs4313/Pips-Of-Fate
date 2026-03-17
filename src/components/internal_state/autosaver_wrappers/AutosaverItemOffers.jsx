import { useState, useEffect } from "react"

export function useItemOffers() {
    const [ItemOffers, setItemOffers] = useState(() => {
        try {
            const loaded = localStorage.getItem("itemOffers")
            return loaded ? JSON.parse(loaded) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem("itemOffers", JSON.stringify(ItemOffers))
    }, [ItemOffers])

    return [ItemOffers, setItemOffers]
}