import "./DiceBoard.css"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import { useEffect, useState } from "react"
import { useInventory } from "./../../items/InventoryContextProvider.jsx"
import { ItemRegistry } from "./../../items/ItemRegistry"

export default function DiceBoard() {
    const engine = useEngine(1)
    const inventory = useInventory()
    const [passiveItemCards, passiveItemIds] = inventory.createPassiveCards() 
    let [activeItemCards, activeItemIds] = inventory.createActiveCards() 
    
    function getRollButtonColor() {
        if(engine.rollsLeft <= 0 && engine.score < engine.quota)
        {
            return "danger"
        }

        return "primary";
    }

    function attachActiveItemListeners() {
        let newActiveCards = [...activeItemCards]
        for(let i = 0; i < activeItemCards.length; i++)
        {
            const targetID = activeItemIds[i]
            const itemCard = activeItemCards[i]
            const activeFunctionCall = function() {
                // you are not allowed to use actives in a game over or on 0 rolls!
                if(engine.rollsLeft != 0)
                {
                    engine.hooks["enqueueStateChange"](ItemRegistry[targetID].active)
                }
            }
            newActiveCards[i] = <div key={targetID} onClick={activeFunctionCall} className="hover:cursor-pointer">{itemCard}</div>
        }
        activeItemCards = newActiveCards
    }

    attachActiveItemListeners()

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <QuotaDisplay totalDiceScore={engine.score} quotaRequired={engine.quota} rollsLeft={engine.rollsLeft}/>
        <div className="grid grid-cols-[1fr_1fr_1fr] h-[100%] align-center">
            <div className="inventory">{passiveItemCards}</div>
            <div className="rolling-container">
                <div className="dice-container">
                    <div className="dice-container @container">
                        {engine.diceValues.map((value, i) => (
                            <DiceCard key={i} diePosition={i} rollState={value}/>
                        ))}
                    </div>
                </div>
                <Button className="w-[clamp(50px,30cqw,300px)]!" onClick={engine.rollDice} active={!engine.rolling} color={getRollButtonColor()}>Roll</Button>
            </div>
            <div className="inventory">{activeItemCards}</div>
        </div>
    </div>)
}