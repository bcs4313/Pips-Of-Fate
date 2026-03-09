import ItemOffer from "./ItemOffer"
import { Button } from "reactstrap"
import { useIsPortrait } from "../../../utilities/useIsPortrait"
import { ItemRegistry } from "../../items/ItemRegistry"
import { useState, useRef, useEffect } from "react"
import Reroll from "./../../../assets/items/sounds_unique/Reroll.mp3"
import InvalidBuy from "./../../../assets/store/InvalidBuy.mp3"
import { useEngine } from "../../internal_state/EngineContextProvider"
import { useItemOffers } from "../../internal_state/autosaver_wrappers/AutosaverItemOffers"

export default function StoreItemSection() {
    const isPortrait = useIsPortrait()
    const [offers, setOffers] = useItemOffers()
    const [offerComponents, setOfferComponents] = useState()
    const rerollAudio = useRef(new Audio(Reroll))
    const invalidBuyAudio = useRef(new Audio(InvalidBuy))
    const engine = useEngine()

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
            return "w-[20cqw]! float-top @container"
        }
        else
        {
            return "h-[6cqh]! w-[20cqw]! float-top @container"
        }
    }

    function getPrice(itemid) {
        return ItemRegistry[itemid]["basePrice"]
    }

    // simply pick 3 items from the item registry and plop them in
    function reroll() {
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            if(ENGINE_STATE["gold"] >= 5)
            {
                rerollAudio.current.currentTime = 0
                rerollAudio.current.play()
                setOffers(() => {
                    return generateRollOffers()
                })
                console.log("buy reroll call")
                const gold = ENGINE_STATE["gold"]
                console.log("gold = " + gold)
                return {...ENGINE_STATE, gold:(gold-5)}
            }
            else
            {
                invalidBuyAudio.current.currentTime = 0
                invalidBuyAudio.current.play()
                return {...ENGINE_STATE}
            }
        })
    }

    function generateRollOffers() {
        let newOffers = []
        let availableItems = Object.keys(ItemRegistry)
        for(let i = 0; i < 3; i++)
        {
            const selectedIndex = Math.floor(Math.random() * availableItems.length)
            const selectedID = availableItems[selectedIndex]
            newOffers.push(selectedID)
            availableItems = availableItems.filter((item) => {
                if(item === selectedID)
                {
                    return false
                }
                return true
            })
        }
        return newOffers
    }

    useEffect(() => {
        console.log("offers")
        console.log(offers)
        let newOffers = []
        for(let i = 0; i < offers.length; i++)
        {
            const selectedID = offers[i]
            let newOffer = <ItemOffer itemid={selectedID} price={ItemRegistry[selectedID]["basePrice"]}/>
            newOffers.push(newOffer)
        }

        console.log("offer components:")
        console.log(newOffers)

        setOfferComponents(newOffers)
    }, [offers]) 

    return(
    <div className="@container w-[100%] mt-[10px] h-[auto] bg-[var(--bs-gray-800)]">
        <h1 className="text-white">Item Shop:</h1>
        <div className={getStoreContainerClass()}>
            <div></div>
            <div className="flex flex-row justify-center">
                {offerComponents}
            </div>
            <div>
                <Button onClick={reroll} className={getRerollButtonStyle()}>
                    <h2 className="att-cost-text text-[15cqw]! mb-0 inline">Reroll</h2>
                    <strong className="text-[var(--bs-yellow)] text-[15cqw] pl-[10cqw]">$5</strong>
                </Button>
            </div>
        </div>
    </div>
    )
}