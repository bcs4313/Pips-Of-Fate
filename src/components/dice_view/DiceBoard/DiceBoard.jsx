import "./DiceBoard.css"
import { useState } from "react"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"

export default function DiceBoard(props) {

    // initialize the dice board
    let diceAmount = 6;
    let [diceValues, setDiceValues] = useState(Array(diceAmount).fill(1));

    function rollDice() {
        console.log("roll");
        let newDiceValues = []
        for(let i = 0; i < diceAmount; i++)
        {
            newDiceValues.push(Math.floor(Math.random() * 6) + 1);  // 0 to 6\
        }

        console.log(newDiceValues);

        setDiceValues(
            newDiceValues
        )
    }

    // generate the dice cards
    let diceCards = [];
    for(let i = 0; i < diceValues.length; i++)
    {
        diceCards.push(<DiceCard rollState={diceValues[i]}/>);
    }

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <div className="rolling-container">
            <div className="dice-container">
                {diceCards}
            </div>
            <Button onClick={rollDice} color="primary">Roll</Button>
        </div>
    </div>)
}