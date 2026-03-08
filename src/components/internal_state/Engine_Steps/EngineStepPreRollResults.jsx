import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepPreRollResults(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("PRE_ROLL_RESULT", engineState, inventoryInterface, hooks)
    return postItemEngineState
}