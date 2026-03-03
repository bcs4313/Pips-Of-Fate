import Inventory from "../../items/Inventory"

export default function EngineStepEndRound(engineState, setEngineState, setRolling) {

    //

    // award gold
    const gold = engineState["gold"]
    console.log("end_round")
    setEngineState((prev) => {
        const newState = {...prev, gold:prev["gold"] + 5, frozenDice:[], remainingFreezes: prev["freezesBought"]}
        newState["lastRoundGold"] = prev["gold"]
        return newState;
    }) 

    // notify engine that the round has ended (allow rolls again)
    setRolling(() => false)

    return engineState
}