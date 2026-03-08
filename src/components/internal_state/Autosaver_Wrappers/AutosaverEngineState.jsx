import { useState, useEffect } from "react"
import { useRoundNumber } from "./AutosaverRoundState.jsx"

// functional model hook that stores your gold in the game
// also exports the total % gold difference from last round
// this hook does NOT allow you to directly set percentdiff, it is private
// for simplicity
export function useEngineState() {
    const [engineState, setEngineState] = useState(() => {
        const savedEngineState = localStorage.getItem("engineState")
        if(savedEngineState != undefined) 
        {
            console.log("loading game... state is")
            console.log(JSON.parse(savedEngineState))
            return JSON.parse(savedEngineState)
        }
        return {
            lastRoundGold:0,
            gold: 0,
            roundNum: 0,
            freezesBought: 0,
            remainingFreezes: 0,
            frozenDice: [],
        }
    })

    useEffect(() => {
        localStorage.setItem("engineState", JSON.stringify(engineState))
    }, [engineState])

    return [engineState, setEngineState]
}