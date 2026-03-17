import { useState, useEffect } from "react"

export function useItems() {
    const [items, setItems] = useState(() => {
        try {
            const loaded = localStorage.getItem("items")
            return loaded ? JSON.parse(loaded) : {}
        } catch {
            return {}
        }
    })

    useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items))
    }, [items])

    return [items, setItems]
}