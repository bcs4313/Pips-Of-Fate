import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepPostRollResults(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("POST_ROLL_RESULT", engineState, inventoryInterface, hooks)
    return postItemEngineState
}