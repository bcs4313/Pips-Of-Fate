import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepEndRound(engineState, inventoryInterface, hooks) {
    function linearSum(n, start = 2.5) {
    return n * (2 * start + (n - 1)) / 2;
    }

    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("END_ROUND", engineState, inventoryInterface, hooks)

    
    // award gold, reset frozen die
    const newState = {...postItemEngineState, gold:postItemEngineState["gold"] + 5 + (linearSum(postItemEngineState["flatGoldUpgradesBought"])), 
        frozenDice:[], remainingFreezes: postItemEngineState["freezesBought"], score:0, roundNum:postItemEngineState["roundNum"]+1}
    newState["lastRoundGold"] = engineState["gold"]
    console.log("end_round")
    hooks["setRolling"](false)

    return {...newState}
}