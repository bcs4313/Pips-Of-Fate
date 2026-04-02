import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepEndRoll(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("END_ROLL", engineState, inventoryInterface, hooks)

    // radiation stack check
    if(engineState["radiationStacks"] != undefined && Math.random() < engineState["radiationStacks"])
    {
        postItemEngineState["radiationStacks"] = 0
    }

    return postItemEngineState
}