import { Button } from 'reactstrap'
import BuyComponent from "./attribute_upgrades/AttUBuyComponent"
import NavigationBar from "./../main_layout/NavigationBar.jsx"
import "./Store.css"

// basic buy img imports
import ExtraDiceImg from "./../../assets/store/ExtraDiceUpgrade.png"
import FrozenDiceImg from "./../../assets/store/FrozenDiceUpgrade.png"
import ExtraRollImg from "./../../assets/store/ExtraRollUpgrade.png"
import MoreGoldImg from "./../../assets/store/GoldUpgrade.png"

// other components
import StoreItemSection from "./item_upgrades/StoreItemSection.jsx"

// context level
import { useEngine } from "./../internal_state/EngineContextProvider.jsx"
import { useState } from "react"

export default function Store() {
    const engine = useEngine()

    // buy prices
    const buyGoldPrice = 10

    function getDieAmountPrice() {
        const basePrice = 15
        const selfBuyIncrease = (engine["hooks"]["getDiceAmount"]()-1) * 2.5
        const generalBuyIncrease = engine.engineState["totalUpgradesBought"] * 2.5
        return basePrice + selfBuyIncrease + generalBuyIncrease
    }

    
    function getFreezePrice() {
        const basePrice = 15
        const selfBuyIncrease = (engine.engineState["freezesBought"]) * 10
        const generalBuyIncrease =  engine.engineState["totalUpgradesBought"] * 2.5
        return basePrice + selfBuyIncrease + generalBuyIncrease
    }

    
    function getExtraRollPrice() {
        const basePrice = 20
        const selfBuyIncrease = (10*Math.pow((engine.engineState["baseRolls"]-2), 1.5))
        const generalBuyIncrease = engine.engineState["totalUpgradesBought"] * 5
        return basePrice + selfBuyIncrease + generalBuyIncrease
    }

    function acquireAdditionalDie(price) {
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            console.log("buy die call")
            const diceAmount = HOOKS["getDiceAmount"]()
            const gold = ENGINE_STATE["gold"]
            const totalBought = ENGINE_STATE["totalUpgradesBought"]
            console.log("gold = " + gold)
            HOOKS["setDiceAmount"](diceAmount+1)
            return {...engine.engineState, gold:(gold-price), totalUpgradesBought:totalBought+1}
        })
    }

    function acquireAdditionalFreeze(price) {
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            console.log("buy freeze call")
            const currentFreezes = ENGINE_STATE["freezesBought"]
            const gold = ENGINE_STATE["gold"]
            const totalBought = ENGINE_STATE["totalUpgradesBought"]
            console.log("gold = " + gold)
            return {...ENGINE_STATE, gold:(gold-price), freezesBought: currentFreezes+1, remainingFreezes: ENGINE_STATE["remainingFreezes"]+1, totalUpgradesBought:totalBought+1}
        })
    }

    function acquireAdditionalRoll(price) {
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {
            console.log("buy extra roll call")
            const gold = ENGINE_STATE["gold"]
            const totalBought = ENGINE_STATE["totalUpgradesBought"]
            console.log("gold = " + gold)
            return {...ENGINE_STATE, gold:(gold-price), baseRolls:ENGINE_STATE["baseRolls"]+1, totalUpgradesBought:totalBought+1}
        })
    }

    return (
        <main className="main-cont">
            <div className="background-wrapper">
                <div className="store-background"></div>
            </div>
            <div className="store-container">
                <div className="upgrades-container">
                    <StoreItemSection/>
                    <h1 className="text-white">Stat Upgrades:</h1>
                    <BuyComponent title="Extra Dice" price={Math.floor(getDieAmountPrice())} upgradefunction={acquireAdditionalDie} 
                    imgPath={ExtraDiceImg} description="Get an additional die for each roll. 
                    Score higher and trigger items more often!"/>
                    <BuyComponent title="+1 Freeze" price={Math.floor(getFreezePrice())} upgradefunction={ acquireAdditionalFreeze }
                    imgPath={FrozenDiceImg} description="Freeze a die value for the rest of the round with a checkbox. 
                    Dice can be unfrozen for free."/>
                    <BuyComponent title="+1 Roll" price={Math.floor(getExtraRollPrice())} upgradefunction={ acquireAdditionalRoll }
                    imgPath={ExtraRollImg} description="Have an extra roll to meet quota every round (applies next round)."/>
                   <BuyComponent title="Gold Income" price={Math.floor(buyGoldPrice)} upgradefunction={ acquireAdditionalRoll }
                    imgPath={MoreGoldImg} description="Make an extra 2.5 gold per round"/>
                </div>
            </div>
            <NavigationBar className="text-center" currentLocation="/store"/>
        </main>
    )
}