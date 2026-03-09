import ItemOffer from "./ItemOffer"
import { Button } from "reactstrap"
import { useIsPortrait } from "./../../../utilities/useIsPortrait"
import { ItemRegistry } from "./../../items/ItemRegistry"

export default function StoreItemSection() {
    const isPortrait = useIsPortrait()

    function getStoreContainerClass() {
        if(!isPortrait)
        {
            return "grid! m-[20px] grid-cols-[calc(20cqw+20px)_auto_calc(20cqw+20px)]"
        }
        else
        {
            return "m-[20px]"
        }
    }

    function getRerollButtonStyle() {
        if(!isPortrait)
        {
            return "w-[20cqw]! float-top"
        }
        else
        {
            return "h-[6cqh]! w-[20cqw]! float-top"
        }
    }

    function getPrice(itemid) {
        return ItemRegistry[itemid]["basePrice"]
    }

    return(
    <div className="@container w-[100%] mt-[10px] h-[auto] bg-[var(--bs-gray-800)]">
        <h1 className="text-white">Item Shop:</h1>
        <div className={getStoreContainerClass()}>
            <div></div>
            <div className="flex flex-row justify-center">
                <ItemOffer itemid="shiny_coin" price={0} />
                <ItemOffer itemid="pot_of_gold" price={0} />
                <ItemOffer itemid="russian_roulette" price={0} />
            </div>
            <div>
                <Button className={getRerollButtonStyle()}>
                    <h2 className="att-cost-text mb-0">Reroll</h2>
                </Button>
            </div>
        </div>
    </div>
    )
}