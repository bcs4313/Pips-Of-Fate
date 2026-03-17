import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepEndRound(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("END_ROUND", engineState, inventoryInterface, hooks)

    // award gold, reset frozen die
    const newState = {...postItemEngineState, gold:postItemEngineState["gold"] + 5 + 2.5*(postItemEngineState["flatGoldUpgradesBought"]), 
        frozenDice:[], remainingFreezes: postItemEngineState["freezesBought"]}
    newState["lastRoundGold"] = engineState["gold"]

    console.log("end_round")
    hooks["setRolling"](false)

    return newState
}