export default function EngineStepEndRound(engineState, setEngineState) {
    console.log("setting gold...")

    const gold = engineState["gold"]

    setEngineState((prev) => {
        const newState = {...prev, gold:prev["gold"] + 7}
        return newState;
    }) 
    
    return engineState
}