import "./DiceBoard.css"
import { useState, useEffect } from "react"
import { Button } from 'reactstrap';
import { useQuota, useScore, useRollsLeft, completeQuota, gameOver } from "./../../internal_state/Round_State.jsx"
import DiceCard from "./../DiceCard/DiceCard.jsx"
import StartRollSFX from "./../../../assets/diceview/DiceBoard/RollStart.mp3"
import FinishRollSFX from "./../../../assets/diceview/DiceBoard/RollFinish.mp3"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"

export default function DiceBoard() {
    // initialize the dice board
    let diceAmount = 1;
    let startRollSFX = new Audio(StartRollSFX)
    let finishRollSFX = new Audio(FinishRollSFX)
    const [diceValues, setDiceValues] = useState(Array(diceAmount).fill(1));
    const [quota, setQuota ] = useQuota()
    const [score, setScore ] = useScore()
    const [rollsLeft, setRollsLeft ] = useRollsLeft()

    const [rolling, setRolling] = useState(false);

    function rollDice() {
        if(rolling) { return; }

        // roll animation phase
        //console.log("rolling dice...")
        let diceAnimArr = []
        for(let i = 0; i < diceAmount; i++)
        {
            diceAnimArr.push(0);
        }
        setDiceValues(() => diceAnimArr)
        setRolling(() => true)
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

            console.log("Roll Result: " + newDiceValues)

            // update score
            let newScore = score;
            for(let i = 0; i < diceAmount; i++)
            {
                newScore += parseInt(newDiceValues[i])
            }
            setScore(newScore)
            setRollsLeft(rollsLeft - 1)

            // quota updates a little after setting score
            setTimeout(function() {
                if(newScore >= quota)
                {
                    setQuota(() => quota + 2)
                    setScore(() => 0)
                    setRollsLeft(() => 3)
                    completeQuota()
                }
                else if(rollsLeft <= 1)
                {
                    setScore(() => 0)
                    setRollsLeft(() => 3)
                    gameOver()
                }
                setRolling(() => false)
            }, 500)
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
            <Button onClick={rollDice} active={!rolling} color="primary">Roll</Button>
        </div>
    </div>)
}