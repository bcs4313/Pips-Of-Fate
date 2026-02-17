import { useState, useEffect } from "react"

// functional model that stores variables representing the round state
export function useQuota() {
    const [quota, setQuota] = useState(() => {
        const savedQuota = parseInt(localStorage.getItem("quota"))
        return savedQuota ? savedQuota : 6
    })
    
    useEffect(() => {
        localStorage.setItem("quota", quota)
    }, [quota]) 

    return [quota, setQuota];
}

export function useScore() {
    const [score, setScore] = useState(() => {
        const storedScore = localStorage.getItem("score")
        return storedScore ? storedScore : 0
    })

    useEffect(() => {
        localStorage.setItem("score", score)
    }, [score]) 

    return [score, setScore];
}

export function useRollsLeft() {
    const [rollsLeft, setRollsLeft] = useState(() => {
        const storedRolls = localStorage.getItem("rollsLeft")
        return storedRolls ? storedRolls : 3
    })

    useEffect(() => {
        localStorage.setItem("rollsLeft", rollsLeft)
    }, [rollsLeft]) 

    return [rollsLeft, setRollsLeft];
}