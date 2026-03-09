import { buildItemCard } from "../../items/UseInventory"
import { Button } from "reactstrap"
import { useRef } from "react"
import { useEngine } from "../../internal_state/EngineContextProvider"
import { useInventory } from "../../items/InventoryContextProvider"
import InvalidBuyAudio from "./../../../assets/store/InvalidBuy.mp3"
import ValidBuyAudio from "./../../../assets/store/SuccessfulBuy.mp3"

export default function ItemOffer({itemid, price, optionalOnBuyFunction})
{
    const engine = useEngine()
    const inventory = useInventory()
    const InvalidBuySFX = useRef(new Audio(InvalidBuyAudio))
    const ValidBuySFX = useRef(new Audio(ValidBuyAudio))
    
    function buyItem() {
        if(engine.engineState["gold"] >= price)
        {
            ValidBuySFX.current.currentTime = 0
            ValidBuySFX.current.play()
            
            engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
                console.log("buy item call")
                const gold = ENGINE_STATE["gold"]
                console.log("gold = " + gold)
                return {...ENGINE_STATE, gold:(gold-price)}
            })

            inventory.addItem(itemid)

            console.log("Item bought: " + itemid+ " for " + price + " gold")
        }
        else
        {
            InvalidBuySFX.current.currentTime = 0
            InvalidBuySFX.current.play()
            console.log("Can't buy the item! Price is: " + price + " for " + itemid)
        }
    }

    return (
        <div className="flex flex-column justify-center content-center">
            {buildItemCard(itemid, 1, "top")}
            <strong className="text-[var(--bs-yellow)] text-[clamp(0.2em,4cqw,2em)] text-[1.4em]">${price}</strong>
            <Button onClick={buyItem} className="w-[clamp(16px,12cqw,128px)]! h-[60px]! m-[clamp(5px, 1cqw, 20px)]!">Buy</Button>
        </div>
    )
}