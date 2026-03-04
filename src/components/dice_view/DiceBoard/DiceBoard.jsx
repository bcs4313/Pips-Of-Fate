import "./DiceBoard.css"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import { useEffect, useState } from "react"
import { useInventory } from "./../../items/InventoryContextProvider.jsx"

export default function DiceBoard() {
    const engine = useEngine(1)
    const inventory = useInventory()
    const itemCards = inventory.createCards()

    function getRollButtonColor() {
        if(engine.rollsLeft <= 0 && engine.score < engine.quota)
        {
            return "danger"
        }

        return "primary";
    }

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <QuotaDisplay totalDiceScore={engine.score} quotaRequired={engine.quota} rollsLeft={engine.rollsLeft}/>
        {itemCards}
        <div className="rolling-container">
            <div className="dice-container">
                <div className="dice-container">
                {engine.diceValues.map((value, i) => (
                    <DiceCard key={i} diePosition={i} rollState={value}/>
                ))}
            </div>
            </div>
            <Button onClick={engine.rollDice} active={!engine.rolling} color={getRollButtonColor()}>Roll</Button>
        </div>
    </div>)
}