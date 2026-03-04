import { buildItemCard } from "./../../items/UseInventory"
import { Button } from "reactstrap"
import { useEngine } from "../../internal_state/EngineContextProvider"
import { useInventory } from "../../items/InventoryContextProvider"

export default function ItemOffer({itemid, price})
{
    function buyItem() {
        if(engine.engineState["gold"] >= price)
        {
            ValidBuySFX.current.currentTime = 0
            ValidBuySFX.current.play()
            upgradefunction(price)
            console.log("Upgrade bought: " + title + " for " + price + " gold")
        }
        else
        {
            InvalidBuySFX.current.currentTime = 0
            InvalidBuySFX.current.play()
            console.log("Can't buy upgrade! Price is: " + price)
        }
    }

    return (
        <div className="flex flex-column justify-center content-center">
            {buildItemCard("shiny_coin", 1, "top")}
            <strong className="text-[var(--bs-yellow)] text-[clamp(0.2em,4cqw,2em)] text-[1.4em]">$10</strong>
            <Button className="w-[clamp(16px,12cqw,128px)]! h-[60px]! m-[clamp(5px, 1cqw, 20px)]!">Buy</Button>
        </div>
    )
}