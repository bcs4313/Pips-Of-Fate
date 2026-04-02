import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepPreRollResults(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("PRE_ROLL_RESULT", engineState, inventoryInterface, hooks)
    return postItemEngineState
}