import { useState, useEffect } from "react"

export function useIsPortrait() {
    const getOrientation = () => window.matchMedia("(orientation: portrait)").matches

    const [isPortrait, setIsPortrait] = useState(getOrientation())

    useEffect(() => {
        const media = window.matchMedia("(orientation: portrait)")

        const listener = () => setIsPortrait(media.matches)

        media.addEventListener("change", listener)

        return () => media.removeEventListener("change", listener)
    }, [])

    return isPortrait
}