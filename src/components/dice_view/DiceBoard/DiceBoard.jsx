import "./DiceBoard.css"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import { useEffect, useState} from "react"

export default function DiceBoard() {
    const engine = useEngine(1)

    function getRollButtonColor() {
        if(engine.rollsLeft <= 0 && engine.score < engine.quota)
        {
            return "danger"
        }

        return "primary";
    }

    function canFreezeOrUnfreeze() {
        return engine.engineState["freezesBought"] > 0
    }

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <QuotaDisplay totalDiceScore={engine.score} quotaRequired={engine.quota} rollsLeft={engine.rollsLeft}/>
        <div className="rolling-container">
            <div className="dice-container">
                <div className="dice-container">
                {engine.diceValues.map((value, i) => (
                    <DiceCard key={i} diePosition={i} freezable={canFreezeOrUnfreeze()} rollState={value}/>
                ))}
            </div>
            </div>
            <Button onClick={engine.rollDice} active={!engine.rolling} color={getRollButtonColor()}>Roll</Button>
        </div>
    </div>)
}