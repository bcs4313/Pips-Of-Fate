export default function EngineStepEndRound(engineState, setEngineState) {
    console.log("setting gold... => ")

    const gold = engineState["gold"]

    setEngineState((prev) => {
        const newState = {...prev, gold:prev["gold"] + 7}
        newState["lastRoundGold"] = prev["gold"]
        console.log(newState)
        return newState;
    }) 
    
    return engineState
}