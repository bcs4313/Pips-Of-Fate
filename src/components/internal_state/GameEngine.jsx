import { useQuota, useScore, useRollsLeft, completeQuota, gameOver } from "./Round_State"
import StartRollSFX from "./../../assets/internal_state/RollStart.mp3"
import FinishRollSFX from "./../../assets/internal_state/RollFinish.mp3"
import { useState, useEffect } from "react"

// The game engine consumes item activations and
// the roll function from the dice board
// @param {number} diceAmount the amount of dice to use in this roll
export function useGameEngine(diceAmount) {
    let startRollSFX = new Audio(StartRollSFX)
    let finishRollSFX = new Audio(FinishRollSFX)

    // saved in storage via internal_state/Round_State
    const [quota, setQuota ] = useQuota()
    const [score, setScore ] = useScore()
    const [rollsLeft, setRollsLeft ] = useRollsLeft()

    // local variables
    const [diceValues, setDiceValues] = useState(Array(diceAmount).fill(1));
    const [rolling, setRolling] = useState(false);

    function rollDice() {
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
            setRollsLeft(() => rollsLeft - 1)

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
                    setQuota(7)
                    gameOver()
                }
                setRolling(() => false)
            }, 400)
        }, 300)
    }

    return { rollDice, rolling, diceValues, score, quota, rollsLeft }
}
