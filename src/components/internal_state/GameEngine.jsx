import { useQuota, useScore, useRollsLeft, useDiceAmount } from "./Autosaver_Wrappers/AutosaverRoundState.jsx"
import StartRollSFX from "./../../assets/internal_state/RollStart.mp3"
import FinishRollSFX from "./../../assets/internal_state/RollFinish.mp3"
import { useRef, useState, useEffect } from "react"
import QuotaCompleteAudio from "./../../assets/internal_state/CompleteQuota.mp3"
import LoseAudio from "./../../assets/internal_state/GameOver.mp3"
import { ConfettiEffect } from "../main_layout/CanvasOverlay.jsx"

// round step imports
import EngineStepEndRound from "./Engine_Steps/EngineStepEndRound.jsx"

// The game engine consumes item activations and
// the roll function from the dice board
// @param {number} diceAmount the amount of dice to use in this roll
export function useGameEngine() {
    let startRollSFX = useRef(new Audio(StartRollSFX))
    let finishRollSFX = useRef(new Audio(FinishRollSFX))

    // saved in storage via internal_state/Round_State
    const [diceAmount, setDiceAmount] = useDiceAmount()
    const [quota, setQuota ] = useQuota()
    const [score, setScore ] = useScore()
    const [rollsLeft, setRollsLeft ] = useRollsLeft()

    // local variables
    const [diceValues, setDiceValues] = useState(Array(diceAmount).fill(1));
    const [rolling, setRolling] = useState(false);

    // engine steps and model
    const [engineState, setEngineState] = useState({
        lastRoundGold:0,
        gold: 0,
        roundNum: 0,
        freezesBought: 0,
        frozenDice: [],
        items: {}
    })

    useEffect(() => {
        console.log("Engine reacting to diceAmount:", diceAmount)

        setDiceValues(Array(diceAmount).fill(1))
    }, [diceAmount])

    function _setEngineState(newState) {
        setEngineState((prev) => newState)
    }

    function _setDiceAmount(val) {
        setDiceAmount((prev) => {
            console.log("setting new die amount => " + prev + " " + val)
            return val
        })
    }

    function _getDiceAmount(val) {
        return diceAmount
    }

    function completeQuota() {
        let winAudio = new Audio(QuotaCompleteAudio)
        ConfettiEffect()
        winAudio.play()
    }

    function gameOver() {
        let loseAudio = new Audio(LoseAudio)
        loseAudio.play()
        setTimeout(function() {
            setRolling(() => false)
            setQuota(() => 7)
            setScore(() => 0)
            setRollsLeft(() => 3)
            setDiceAmount(() => 1)
            setEngineState(() => {
                return {
                    lastRoundGold:0,
                    gold: 0,
                    roundNum: 0,
                    items: {}
                }
            })
        }, 4000) 
    }

    function rollDice() {
        // roll animation phase
        if(rolling) { return }

        let diceAnimArr = []
        for(let i = 0; i < diceAmount; i++)
        {
            // frozen dice case
            if(engineState.frozenDice && engineState.frozenDice.includes(i))
            {
                diceAnimArr.push(diceValues[i]);
            }
            else
            {
                // unfrozen dice case
                diceAnimArr.push(0);
            }
        }
        setDiceValues(() => diceAnimArr)
        setRolling(() => true)
        startRollSFX.current.currentTime = 0
        startRollSFX.current.play();

        // roll completion
        setTimeout(function() {
            finishRollSFX.current.currentTime = 0
            finishRollSFX.current.play();
            //console.log("animation done")
            let newDiceValues = []
            for(let i = 0; i < diceAmount; i++)
            {
                // frozen dice case
                if(engineState.frozenDice && engineState.frozenDice.includes(i))
                {
                    newDiceValues.push(diceValues[i]);
                }
                else
                {
                    // unfrozen dice case
                    newDiceValues.push(Math.floor(Math.random() * 6) + 1);  // 0 to 6\
                }
            }

            setDiceValues(
                () => newDiceValues
            )

            console.log("Roll Result: " + newDiceValues)

            const rollSum = newDiceValues.reduce((a,b)=>a+b,0);

            // update score
            setScore((prev) => { return prev + rollSum; })
            // quota updates a little after setting score
            setTimeout(function() {
                setScore((prev) => {
                let newScore = prev
                if(newScore >= quota)
                {
                    setQuota(() => Math.floor(quota*1.1) + 2)
                    setRollsLeft(() => 3)
                    completeQuota()
                    return 0;
                }
                return newScore
                })

                if(rollSum + score >= quota) { EngineStepEndRound(engineState, setEngineState, setRolling) }
            }, 400)

            setRollsLeft(prevRolls => {
                const newRollsLeft = prevRolls - 1
                const newScore = score + rollSum
                if(newRollsLeft <= 0 && newScore < quota)
                {
                    console.log("GAME OVER: " + newScore + " quota = " + quota)
                    gameOver()
                    return 0
                }
                else if (newScore < quota) 
                {
                   setRolling(() => false)
                }
                return newRollsLeft 
            })
        }, 300)
    }

    return { rollDice, rolling, diceValues, score, quota, rollsLeft, engineState, hooks: {
        "getDiceAmount": _getDiceAmount,
        "setDiceAmount": _setDiceAmount,
        "setEngineState": _setEngineState
    }}
}