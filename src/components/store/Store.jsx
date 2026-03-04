import { Button } from 'reactstrap'
import BuyComponent from "./AttributeUpgrades/AttUBuyComponent"
import NavigationBar from "./../main_layout/NavigationBar.jsx"
import "./Store.css"

// basic buy img imports
import ExtraDiceImg from "./../../assets/store/ExtraDiceUpgrade.png"
import FrozenDiceImg from "./../../assets/store/FrozenDiceUpgrade.png"

// other components
import StoreItemSection from "./ItemUpgrades/StoreItemSection"

// context level
import { useEngine } from "./../internal_state/EngineContextProvider.jsx"
import { useState } from "react"

export default function Store() {
    const engine = useEngine()

    // buy prices
    const buyDiePrice = 15 + (engine["hooks"]["getDiceAmount"]()-1) * 5
    const buyFreezePrice = 10 + (engine.engineState["freezesBought"]) * 10

    function acquireAdditionalDie(price) {
            engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            console.log("buy die call")
            const diceAmount = HOOKS["getDiceAmount"]()
            const gold = ENGINE_STATE["gold"]
            console.log("gold = " + gold)
            HOOKS["setDiceAmount"](diceAmount+1)
            return {...engine.engineState, gold:(gold-price)}
        })
    }

    function acquireAdditionalFreeze(price) {
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            console.log("buy freeze call")
            const currentFreezes = ENGINE_STATE["freezesBought"]
            const gold = ENGINE_STATE["gold"]
            console.log("gold = " + gold)
            return {...ENGINE_STATE, gold:(gold-price), freezesBought: currentFreezes+1, remainingFreezes: ENGINE_STATE["remainingFreezes"]+1}
        })
    }

    return (
        <main>
            <div className="store-container">
                <div className="upgrades-container">
                    <BuyComponent title="Extra Dice" price={buyDiePrice} upgradefunction={acquireAdditionalDie} 
                    imgPath={ExtraDiceImg} description="Get an additional die for each roll. 
                    Score higher and trigger items more often!"/>
                    <BuyComponent title="+1 Freeze" price={buyFreezePrice} upgradefunction={ acquireAdditionalFreeze }
                    imgPath={FrozenDiceImg} description="Freeze a die value for the rest of the round with a checkbox. 
                    Dice can be unfrozen for free."/>
                    <StoreItemSection/>
                </div>
            </div>
            <NavigationBar className="text-center" currentLocation="/store"/>
        </main>
    )
}