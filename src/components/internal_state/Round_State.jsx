import { useState, useEffect } from "react"
import { ConfettiEffect } from "./../main_layout/CanvasOverlay"
import QuotaCompleteAudio from "./../../assets/diceview/internal_state/CompleteQuota.mp3"

// functional model that stores variables representing the round state
export function useQuota() {
    const [quota, setQuota] = useState(() => {
        const savedQuota = parseInt(localStorage.getItem("quota"))
        return savedQuota ? savedQuota : 7
    })
    
    useEffect(() => {
        localStorage.setItem("quota", quota)
    }, [quota]) 

    return [quota, setQuota];
}

export function useScore() {
    const [score, setScore] = useState(() => {
        const storedScore = parseInt(localStorage.getItem("score"))
        return storedScore ? storedScore : 0
    })

    // links to all score based events and quota completion
    useEffect(() => {
        localStorage.setItem("score", score)

        let quota = localStorage.getItem("quota")

        if(score >= quota)
        {
            completeQuota()
        }
    }, [score]) 

    return [score, setScore];
}

export function useRollsLeft() {
    const [rollsLeft, setRollsLeft] = useState(() => {
        const storedRolls = parseInt(localStorage.getItem("rollsLeft"))
        return storedRolls ? storedRolls : 3
    })

    useEffect(() => {
        localStorage.setItem("rollsLeft", rollsLeft)
    }, [rollsLeft]) 

    return [rollsLeft, setRollsLeft];
}

export function completeQuota() {
    let winAudio = new Audio(QuotaCompleteAudio)
    ConfettiEffect()
    winAudio.play()
}