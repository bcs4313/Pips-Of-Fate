import "./DiceBoard.css"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"

export default function DiceBoard() {
    // initialize the dice board
    let diceAmount = 1;

    const engine = useEngine(diceAmount)
    // generate the dice cards
    let diceCards = [];
    for(let i = 0; i < engine.diceValues.length; i++)
    {
        diceCards.push(<DiceCard key={i} rollState={engine.diceValues[i]}/>)
    }

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
        <div className="rolling-container">
            <div className="dice-container">
                {diceCards}
            </div>
            <Button onClick={engine.rollDice} active={!engine.rolling} color={getRollButtonColor()}>Roll</Button>
        </div>
    </div>)
}