import { useState } from "react"
import { ItemRegistry } from "./ItemRegistry"
import { useItems } from "./../internal_state/Autosaver_Wrappers/AutosaverItems"
import ItemCard from "./ItemCard"

// Items are assigned to specifc engine step ids, of which they check
// and execute their own code. EngineSteps and other events call forwardEngineStep(<identity>) somewhere in their
// execution to trigger items that belong to that step. This is a simple observer design pattern
export default function useInventory() {
    // an object consisting of item ids as keys and integer values
    // as stack counts
    const [items, setItems] = useItems()
    // add an item id to the item list.
    function addItem(itemID) {
        setItems((prev) => {
            const newObj = {...prev}
            newObj[itemID] === undefined ? newObj[itemID] = 1 : newObj[itemID] += 1
            return newObj
        })
    }

    // trigger item functions for all items linked to the stepIdentity, forwarding the current engine state
    // @param stepIdentity { string }
    function forwardEngineStep(stepIdentity, prevEngineState, inventoryInterface, hooks) {
        //console.log("forwardEngineStep")
        const itemsSnapshot = {...items}
        let nextEngineState = {...prevEngineState}

        for(const [itemID, count] of Object.entries(itemsSnapshot)) {
            const steps = ItemRegistry[itemID].steps
            const callback = steps[stepIdentity]
            //console.log("item steps: ")
            //console.log(steps)
            //console.log("stepIdentity: ")
            //console.log(stepIdentity)
            //console.log("itemID: " + itemID + " count: " + count + " callback: " + callback)
            if(!callback) { continue }
            for(let i = 0; i < count; i++)
            {
                //console.log("item callback -> " + itemID)
                nextEngineState = callback(nextEngineState, inventoryInterface, hooks)
            }
        }
        return nextEngineState
    }

    function createPassiveItemCards() 
    {
        const itemCardList = []
        for(const [itemID, count] of Object.entries(items))
        {
            if(ItemRegistry[itemID].active == undefined)
            {
                itemCardList.push(buildItemCard(itemID, count, "right", false))
            }
        }
        return itemCardList
    }

    
    function createActiveItemCards() 
    {
        const itemCardList = []
        for(const [itemID, count] of Object.entries(items))
        {
            if(ItemRegistry[itemID].active != undefined)
            {
                itemCardList.push(buildItemCard(itemID, count, "left", true))
            }
        }
        return itemCardList
    }

    const inventoryInterface = {
        "forwardStep": forwardEngineStep,
        "addItem": addItem,
        "createCards": createPassiveItemCards,
    }

    return inventoryInterface
}

export function buildItemCard(itemID, count, tooltipDir, isActive) {
    const itemName = ItemRegistry[itemID]["name"]
    const itemRarity = ItemRegistry[itemID]["rarity"]
    const itemDescription = ItemRegistry[itemID]["description"]
    const itemImagePath = ItemRegistry[itemID]["image"]

    const clickAction = function() {}
    const extraClasses = ""
    if(isActive)
    {
        clickAction = ItemRegistry[itemID]["active"]
        extraClasses ="hover:cursor-pointer"
    }
    
    return <ItemCard className={extraClasses} onClick={clickAction} 
    id={itemID} tooltipDirection={tooltipDir} key={itemID} name={itemName} 
    stacks={count} rarity={itemRarity} description={itemDescription} 
    imagePath={itemImagePath}/>
}