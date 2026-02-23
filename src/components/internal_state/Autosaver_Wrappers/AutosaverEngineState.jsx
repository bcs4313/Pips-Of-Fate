import { useState, useEffect } from "react"
import { useRoundNumber } from "./AutosaverRoundState.jsx"

// functional model hook that stores your gold in the game
// also exports the total % gold difference from last round
// this hook does NOT allow you to directly set percentdiff, it is private
// for simplicity
export function useEngineState() {
    /*
    const [gold, setGold] = useState(() => {
        const savedGold = parseInt(localStorage.getItem("gold"))
        return savedGold ? savedGold : 0
    })

    const [round, setRound] = useRoundNumber()
    const [lastRound, setLastRound] = useState(round)
    const [lastRoundGold, setLastRoundGold] = useState(gold)

    const [percentDiff, setPercentDiff] = useState(() => {
        const savedDiff = parseInt(localStorage.getItem("percentdiff"))
        return savedDiff ? savedDiff : 0
    })

    useEffect(() => {
        localStorage.setItem("gold", gold)
    }, [gold])


    return [gold, setGold]
    */
}