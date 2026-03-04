import ItemOffer from "./ItemOffer"
import { Button } from "reactstrap"

export default function StoreItemSection() {
    return(
    <div className="w-[80%] mt-[10px] h-[500px] bg-[var(--bs-gray-800)]">
        <h1 className="text-white">Items:</h1>
        <div className="flex flex-row justify-center gap-[40px]">
            <ItemOffer/>
            <ItemOffer/>
            <ItemOffer/>
        </div>
    </div>
    )
}