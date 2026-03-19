import { useState, useEffect } from "react"

export function useItemData() {
    const [itemData, setItemData] = useState(() => {
        try {
            const loaded = localStorage.getItem("itemData")
            return loaded ? JSON.parse(loaded) : {}
        } catch {
            return {}
        }
    })

    useEffect(() => {
        localStorage.setItem("itemData", JSON.stringify(itemData))
    }, [itemData])

    return [itemData, setItemData]
}