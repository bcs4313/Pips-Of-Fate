import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepEndRound(engineState, inventoryInterface, hooks) {
    console.log(hooks)
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("END_ROUND", engineState)

    // award gold
    const newState = {...postItemEngineState, gold:postItemEngineState["gold"] + 5, frozenDice:[], remainingFreezes: postItemEngineState["freezesBought"]}
    newState["lastRoundGold"] = engineState["gold"]

    console.log("end_round")

    hooks["setEngineState"](newState)

    // notify engine that the round has ended (allow rolls again)
    hooks["setRolling"](false)
}