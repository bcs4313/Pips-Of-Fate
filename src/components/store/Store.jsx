import { Button } from 'reactstrap'
import BuyComponent from "./AttributeUpgrades/AttUBuyComponent"
import NavigationBar from "./../main_layout/NavigationBar.jsx"
import "./Store.css"

// basic buy img imports
import ExtraDiceImg from "./../../assets/store/ExtraDiceUpgrade.png"
import FrozenDiceImg from "./../../assets/store/FrozenDiceUpgrade.png"

// context level
import { useEngine } from "./../internal_state/EngineContextProvider.jsx"
import { useState } from "react"

export default function Store() {
    const engine = useEngine()

    // buy prices
    const buyDiePrice = 10 + (engine["hooks"]["getDiceAmount"]()-1) * 10

    function acquireAdditionalDie(price) {
        console.log("diecall")
        const diceAmount = engine.hooks["getDiceAmount"]()
        const gold = engine.engineState["gold"]
        console.log("gold = " + gold)
        engine.hooks["setDiceAmount"](diceAmount+1)
        engine.hooks["setEngineState"]({...engine.engineState, gold:(gold-price)})
    }

    return (
        <main>
            <div className="store-container overflow-hidden">
                <div className="store-baseupgrades-container">
                    <BuyComponent title="Extra Dice" price={buyDiePrice} upgradefunction={acquireAdditionalDie} 
                    imgPath={ExtraDiceImg} description="Get an additional die for each roll. 
                    Score higher and trigger items more often!"/>
                    <BuyComponent title="+1 Freeze" price={10} 
                    imgPath={FrozenDiceImg} description="Freeze a die value for the rest of the round with a checkbox. 
                    Dice can be unfrozen for free."/>
                </div>
            </div>
            <NavigationBar currentLocation="/store"/>
        </main>
    )
}