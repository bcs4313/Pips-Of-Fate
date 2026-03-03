import { useRef, useState } from "react"
import { ItemRegistry } from "./ItemRegistry"
import ItemCard from "./ItemCard"

// Items are assigned to specifc engine steps, of which they check
// and execute their own code. EngineSteps call forwardEngineStep(<identity>) somewhere in their
// execution to trigger items that belong to that step.

// @param stepLinks { list<string> } which engine steps does the item run its conditions on? (Engine_Step ids)
// @param effect { function() }
// a function. The function makes conditional checks with useEngine as a source of knowledge
export default function Inventory() {
    // an object consisting of item ids as keys and integer values
    // as stack counts
    const [items, setItems] = useState({"shiny_coin":1})

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
    // @param setEngineState { function }
    function forwardEngineStep(stepIdentity, setEngineState) {
        setEngineState((prevEngineState) => {
            let nextEngineState = {...prevEngineState}

            for(const [itemID, count] of Object.entries(items)) {
                const steps = ItemRegistry[itemID].steps
                const callback = steps[stepIdentity]
                
                if(!callback) { continue }
                for(let i = 0; i < count; i++)
                {
                    nextEngineState = callback(nextEngineState)
                }
            }
            return nextEngineState
        })
    }

    function createItemCards() 
    {
        const itemCardList = []
        for(const [itemID, count] of Object.entries(items))
        {
            const itemName = ItemRegistry[itemID]["name"]
            const itemRarity = ItemRegistry[itemID]["rarity"]
            const itemDescription = ItemRegistry[itemID]["description"]
            const itemImagePath = ItemRegistry[itemID]["image"]
            itemCardList.push(<ItemCard id={itemID} name={itemName} stacks={count} rarity={itemRarity} description={itemDescription} imagePath={itemImagePath}/>)
        }
        return itemCardList
    }

    return (createItemCards())
}