import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepStartRoll(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("START_ROLL", engineState, inventoryInterface, hooks)
    return postItemEngineState
}