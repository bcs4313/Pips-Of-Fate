import { useState, useEffect } from "react"

// functional model hook that stores basic upgrades in the game
export function useBaseUpgrades() {
    const [upgrades, setUpgrades] = useState(() => {
        const loadExtraDice = parseInt(localStorage.getItem("extra_dice"))
        let trueExtraDice = loadExtraDice ? loadExtraDice : 0 
        
        const loadFreezes = parseInt(localStorage.getItem("freezes"))
        let trueFreezes = loadFreezes ? loadFreezes: 0 

        return {
        "extra_dice":trueExtraDice,
        "freezes":trueFreezes,
    }
    })
    
    useEffect(() => {
        localStorage.setItem("extra_dice", upgrades["extra_dice"])
        localStorage.setItem("freezes", upgrades["freezes"])
    }, [upgrades]) 

    return [upgrades, setUpgrades]
}