export default function EngineStepEndRound(engineState, setEngineState, setRolling) {
    const gold = engineState["gold"]
    console.log("end_round")
    setEngineState((prev) => {
        const newState = {...prev, gold:prev["gold"] + 10}
        newState["lastRoundGold"] = prev["gold"]
        return newState;
    }) 
    setRolling(() => false)
    return engineState
}