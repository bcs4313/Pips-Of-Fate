import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepPostRollResults(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("POST_ROLL_RESULT", engineState, inventoryInterface, hooks)
    return postItemEngineState
}