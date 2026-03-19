import ItemOffer from "./ItemOffer"
import { Button } from "reactstrap"
import { useIsPortrait } from "../../../utilities/useIsPortrait"
import { ItemRegistry } from "../../items/ItemRegistry"
import { useState, useRef, useEffect } from "react"
import Reroll from "./../../../assets/items/sounds_unique/Reroll.mp3"
import InvalidBuy from "./../../../assets/store/InvalidBuy.mp3"
import { useEngine } from "../../internal_state/EngineContextProvider"
import { useItemOffers } from "./../../internal_state/autosaver_wrappers/AutosaverItemOffers"
import "./StoreItemSection.css"

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
            return "w-[20cqw]! text-center @container"
        }
        else
        {
            return "h-[6cqh]! text-center w-[20cqw]! @container"
        }
    }

    function getPrice(itemid) {
        return ItemRegistry[itemid]["basePrice"]
    }

    // simply pick 3 items from the item registry and plop them in
    function reroll() {
        const curRerollPrice = parseInt(engine.engineState["rerollPrice"])
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            if(ENGINE_STATE["gold"] >= curRerollPrice)
            {
                rerollAudio.current.currentTime = 0
                rerollAudio.current.play()
                setOffers(() => {
                    return generateRollOffers()
                })
                console.log("buy reroll call")
                const gold = ENGINE_STATE["gold"]
                console.log("gold = " + gold)
                return {...ENGINE_STATE, gold:(gold-curRerollPrice), rerollPrice: curRerollPrice+2.5}
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
        let newOffers = []
        let buyCallback = function(curID) {
            console.log("buy callback")
            console.log(curID)
            setOffers((prev) => {
                return prev.filter((prevID) => {
                    return prevID != curID
                })
            })
        }

        for(let i = 0; i < offers.length; i++)
        {
            const selectedID = offers[i]
            let newOffer = <ItemOffer key={i} buyCallback={buyCallback} itemid={selectedID} price={ItemRegistry[selectedID]["basePrice"]}/>
            newOffers.push(newOffer)
        }
        setOfferComponents(newOffers)
    }, [offers]) 

    useEffect(() => {
        if(offers.length == 0)
        {
            setOffers(() => {
                return generateRollOffers()
            })
        }
    }, [])

    return(
    <div className="@container w-[100%] mt-[10px] h-[auto] bg-gray-800/50 ">
        <h1 className="text-white">Item Shop:</h1>
        <div className={getStoreContainerClass()}>
            <div></div>
            <div className="flex flex-row justify-center">
                {offerComponents}
            </div>
            <div className="purchase-bar @container">
                <Button onClick={reroll} className="reroll-cost-btn">
                    <h2 className="att-cost-text mb-0">Reroll: <span className="text-yellow-300">${engine.engineState["rerollPrice"]}</span></h2>
                </Button>
            </div>
        </div>
    </div>
    )
}