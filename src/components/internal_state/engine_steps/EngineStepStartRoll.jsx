import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepStartRoll(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("START_ROLL", engineState, inventoryInterface, hooks)
    return postItemEngineState
}