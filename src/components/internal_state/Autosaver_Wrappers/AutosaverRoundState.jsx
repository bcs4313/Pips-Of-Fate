import { useState, useEffect } from "react"

// functional model hook that stores variables representing the round state
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

export function useRoundNumber() {
    const [round, setRound] = useState(() => {
    const storedRounds = parseInt(localStorage.getItem("round_num"))
    return storedRounds ? storedRounds : 0
    })

    useEffect(() => {
        localStorage.setItem("round_num", round)
    }, [round]) 

    return [round, setRound];
}