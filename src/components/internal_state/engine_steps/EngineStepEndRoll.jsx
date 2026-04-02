import { useInventory } from "../../items/InventoryContextProvider"

export default async function EngineStepEndRoll(engineState, inventoryInterface, hooks) {
    // trigger items under this step
    let postItemEngineState = await inventoryInterface.forwardStep("END_ROLL", engineState, inventoryInterface, hooks)

    const UIBus = hooks["getUIBus"]()
    // radiation stack check
    if(engineState["radiationStacks"] != undefined && Math.random() < (parseFloat(engineState["radiationStacks"])/100))
    {
        console.log("radiation stack trigger")
        postItemEngineState["radiationStacks"] = 0
        UIBus.emit("SHOP_RADIATION_FLASH")
        hooks["playSound"]("RadUpgradeGet")

        // generate a target discount
        let discountTargets = ["attr-buy-button-Extra Dice", "attr-buy-button-+1 Freeze", "attr-buy-button-+1 Roll", "attr-buy-button-Gold Income"]
        if(postItemEngineState["radiationUpgradeDiscounts"] == undefined)
        {
            console.log("setting radiationUpgradeDiscounts -> new val")
            const target = discountTargets[Math.floor(Math.random() * discountTargets.length)]
            postItemEngineState["radiationUpgradeDiscounts"] = {
                [target]:1
            }
        }
        else
        {
            const target = discountTargets[Math.floor(Math.random() * discountTargets.length)]
            console.log("setting radiationUpgradeDiscounts -> existing val")
            console.log("target is " + target)
            if(postItemEngineState["radiationUpgradeDiscounts"][target] != undefined)
            {
                postItemEngineState["radiationUpgradeDiscounts"][target] += 1
            }
            else
            {
                postItemEngineState["radiationUpgradeDiscounts"][target] = 1
            }
        }
    }
    return {...postItemEngineState}
}