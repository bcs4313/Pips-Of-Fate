import "./DiceBoard.css"
import { useState, useEffect } from "react"
import { Button } from 'reactstrap';
import { useQuota, useScore, useRollsLeft } from "./../../internal_state/Round_State.jsx"
import DiceCard from "./../DiceCard/DiceCard.jsx"
import StartRollSFX from "./../../../assets/diceview/DiceBoard/RollStart.mp3"
import FinishRollSFX from "./../../../assets/diceview/DiceBoard/RollFinish.mp3"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"

export default function DiceBoard(props) {
    // initialize the dice board
    let diceAmount = 1;
    let startRollSFX = new Audio(StartRollSFX)
    let finishRollSFX = new Audio(FinishRollSFX)
    const [diceValues, setDiceValues] = useState(Array(diceAmount).fill(1));
    const [quota, setQuota ] = useQuota()
    const [score, setScore ] = useScore()
    const [rollsLeft, setRollsLeft ] = useRollsLeft()

    function rollDice() {
        // roll animation phase
        //console.log("rolling dice...")
        let diceAnimArr = []
        for(let i = 0; i < diceAmount; i++)
        {
            diceAnimArr.push(0);
        }
        setDiceValues(() => diceAnimArr)
        startRollSFX.play();

        // roll completion
        setTimeout(function() {
            finishRollSFX.play();
            //console.log("animation done")
            let newDiceValues = []
            for(let i = 0; i < diceAmount; i++)
            {
                newDiceValues.push(Math.floor(Math.random() * 6) + 1);  // 0 to 6\
            }

            setDiceValues(
                () => newDiceValues
            )

            // update score
            let newScore = score;
            for(let i = 0; i < diceAmount; i++)
            {
                newScore += parseInt(newDiceValues[i])
            }
            setScore(newScore)
            setRollsLeft(rollsLeft - 1)
        }, 300)
    }
    
    // generate the dice cards
    let diceCards = [];
    for(let i = 0; i < diceValues.length; i++)
    {
        diceCards.push(<DiceCard key={i} rollState={diceValues[i]}/>);
    }

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <QuotaDisplay totalDiceScore={score} quotaRequired={quota} rollsLeft={rollsLeft}/>
        <div className="rolling-container">
            <div className="dice-container">
                {diceCards}
            </div>
            <Button onClick={rollDice} color="primary">Roll</Button>
        </div>
    </div>)
}