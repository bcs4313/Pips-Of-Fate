import { useState } from "react"
import { ItemRegistry } from "./ItemRegistry"
import { useItems } from "../internal_state/autosaver_wrappers/AutosaverItems"
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
            if(!steps) { continue }
            const callback = steps[stepIdentity]
            if(!callback) { continue }
            for(let i = 0; i < count; i++)
            {
                nextEngineState = callback(nextEngineState, inventoryInterface, hooks)
            }
        }
        return nextEngineState
    }

    function createPassiveItemCards() 
    {
        const itemCardList = []
        const itemIDList = []
        for(const [itemID, count] of Object.entries(items))
        {
            if(ItemRegistry[itemID].active == undefined)
            {
                itemCardList.push(buildItemCard(itemID, count, "right"))
                itemIDList.push(itemID)
            }
        }
        return [itemCardList, itemIDList]
    }

    
    function createActiveItemCards() 
    {
        const itemCardList = []
        const itemIDList = []
        for(const [itemID, count] of Object.entries(items))
        {
            if(ItemRegistry[itemID].active != undefined)
            {
                itemCardList.push(buildItemCard(itemID, count, "left"))
                itemIDList.push(itemID)
            }
        }
        return [itemCardList, itemIDList]
    }

    function clearInventory() {
        setItems(() => [])
    }

    const inventoryInterface = {
        "forwardStep": forwardEngineStep,
        "addItem": addItem,
        "createPassiveCards": createPassiveItemCards,
        "createActiveCards": createActiveItemCards,
        "clear": clearInventory
    }

    return inventoryInterface
}

export function buildItemCard(itemID, count, tooltipDir) {
    const itemName = ItemRegistry[itemID]["name"]
    const itemRarity = ItemRegistry[itemID]["rarity"]
    const itemDescription = ItemRegistry[itemID]["description"]
    const itemImagePath = ItemRegistry[itemID]["image"]
    
    return <ItemCard 
    id={itemID} tooltipDirection={tooltipDir} key={itemID} name={itemName} 
    stacks={count} rarity={itemRarity} description={itemDescription} 
    imagePath={itemImagePath}/>
}