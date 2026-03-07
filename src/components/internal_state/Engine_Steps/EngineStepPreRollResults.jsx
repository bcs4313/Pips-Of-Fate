import { useInventory } from "../../items/InventoryContextProvider"

export default function EnginPreRollResults(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("PRE_ROLL_RESULT", engineState)
    return postItemEngineState
}