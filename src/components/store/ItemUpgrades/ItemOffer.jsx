import { buildItemCard } from "./../../items/UseInventory"
import { Button } from "reactstrap"

export default function ItemOffer()
{
    return (
        <div className="flex flex-column justify-center content-center">
            {buildItemCard("shiny_coin", 1, "top")}
            <strong className="text-[var(--bs-yellow)] text-[1.4em]">$10</strong>
            <Button className="w-[100px]! h-[60px]!">Buy</Button>
        </div>
    )
}