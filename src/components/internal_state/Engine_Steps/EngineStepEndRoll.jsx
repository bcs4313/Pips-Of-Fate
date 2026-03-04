import { useInventory } from "../../items/InventoryContextProvider"

export default function EngineStepEndRoll(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = inventoryInterface.forwardStep("END_ROLL", engineState)
    hooks["setEngineState"](postItemEngineState)
}