import { useQuota, useScore, useRollsLeft, useDiceAmount } from "./autosaver_wrappers/AutosaverRoundState.jsx"
import { useEngineState } from "./autosaver_wrappers/AutosaverEngineState.jsx"
import StartRollSFX from "./../../assets/internal_state/RollStart.mp3"
import FinishRollSFX from "./../../assets/internal_state/RollFinish.mp3"
import { useRef, useState, useEffect } from "react"
import QuotaCompleteAudio from "./../../assets/internal_state/CompleteQuota.mp3"
import LoseAudio from "./../../assets/internal_state/GameOver.mp3"
import { ConfettiEffect } from "../main_layout/CanvasOverlay.jsx"

// inventory import
import { useInventory } from "./../items/InventoryContextProvider.jsx"

// UIBus import
import { useUIBus } from "../vfx/UIBusContextProvider.jsx"

// round step imports
import EngineStepPreRollResults from "./engine_steps/EngineStepPreRollResults.jsx"
import EngineStepEndRoll from "./engine_steps/EngineStepEndRoll.jsx"
import EngineStepEndRound from "./engine_steps/EngineStepEndRound.jsx"

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
    const [engineState, setEngineState] = useEngineState()

    // inventory
    const InventoryInterface = useInventory()

    // UI Bus
    const UIBus = useUIBus()

    // hooks
    const engineHooks = {
        "getDiceAmount": _getDiceAmount,
        "setDiceAmount": _setDiceAmount, // not queue enforced
        "setRolling": _setRolling, // not queue enforced
        "getDiceValues": _getDiceValues,
        "setDiceValues": _setDiceValues, // queue only
        "addScore": _addScore, // queue only
        "getScore": _getScore,
        "forceGameOver": _forceGameOver,
        "getUIBus": _getUIBus,
        "enqueueStateChange": _enqueueStateChange,
    }

    // queue system for asynchronous state changes //
    // engine steps and other updates MUST enter this queue
    const stateQueue = useRef([])
    const engineRunning = useRef(false)
    const engineStateRef = useRef(engineState)

    // prevent stale engineStates in the queue
    useEffect(() => {
        engineStateRef.current = engineState
    }, [engineState])

    // your stateful function can in 3 arguments,
    // engineState, inventoryInterface, hooks
    // it MUST return the engineState
    async function _enqueueStateChange(statefulFunction) {
        //console.log("queueing function:")
        //console.log(statefulFunction)

        return new Promise(async (resolve, reject) => {
            stateQueue.current.push(statefulFunction)
            if(engineRunning.current == true)
            {
                //console.log("queue currently running: pushing event function to active queue")
            }
            else
            {
                engineRunning.current = true
                let state = engineStateRef.current

                // not running, begin the loop
                while(stateQueue.current.length > 0)
                {
                    const step = stateQueue.current.shift()
                    state = await step(state, InventoryInterface, engineHooks)
                    setEngineState(() => state)
                }

            }
            engineRunning.current = false
            resolve()
        })
    }
    // end of queue system //

    // useEffect reacting to a dice amount change
    useEffect(() => {
        console.log("Engine reacting to diceAmount:", diceAmount)
        
        let newDiceValues = Array(diceAmount).fill(1)
        for(let i = 0; i < diceValues.length; i++)
        {
            if(i < newDiceValues.length)
            {
                newDiceValues[i] = diceValues[i]
            }
        }

        setDiceValues(newDiceValues)
    }, [diceAmount])

    // hook
    function _getUIBus() {
        return UIBus
    }

    // hook
    function _setDiceAmount(val) {
        setDiceAmount((prev) => {
            console.log("setting new die amount => " + prev + " " + val)
            return val
        })
    }

    // hook
    function _setRolling(val) {
        setRolling((prev) => val)
    }

    // hook
    function _getDiceAmount(val) {
        return diceAmount
    }

    // hook
    function _getDiceValues(val) {
        return diceValues
    }

    // hook
    function _forceGameOver() {
        gameOver()
    }

    // hook
    // utilizes a parallel list
    //@param indexes { list } target die indexes to change
    //@param values { list } target values to set
    function _setDiceValues(indexes, values) {
        _enqueueStateChange((engineState) => {
            setDiceValues((prev) => {
                let newDiceValues = [...prev]
                for(let i = 0; i < indexes.length; i++)
                {
                    newDiceValues[indexes[i]] = values[i]
                }
                return newDiceValues
            })
            return engineState
        })
    }

    // hook
    function _addScore(val) {
        _enqueueStateChange((engineState) => {
            setScore((prev) => {
                return val+prev
            })
            return engineState
        })
    }

    // hook
    function _getScore() {
        console.log("get score called")
        return score
    }


    function completeQuotaFX() {
        let winAudio = new Audio(QuotaCompleteAudio)
        ConfettiEffect()
        winAudio.play()
    }

    function gameOver() {
        setRolling(() => true)
        setRollsLeft(() => 0)
        let loseAudio = new Audio(LoseAudio)
        loseAudio.play()
        setTimeout(function() {
            InventoryInterface.clear()
            setRolling(() => false)
            setQuota(() => 6)
            setScore(() => 0)
            setRollsLeft(() => 3)
            setDiceAmount(() => 1)
            setEngineState(() => {
                return {
                    lastRoundGold:0,
                    gold: 0,
                    roundNum: 0,
                    freezesBought: 0,
                    remainingFreezes:0,
                    frozenDice: [],
                }
            })
        }, 4000) 
    }

    async function rollDice() {
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
        setTimeout(async function() {
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

            await _enqueueStateChange(EngineStepPreRollResults) 

            setDiceValues(
                () => newDiceValues
            ) 

            console.log("Roll Result: " + newDiceValues)

            const rollSum = newDiceValues.reduce((a,b)=>a+b,0);

            // update score
            setScore((prev) => { return parseFloat((prev + rollSum).toFixed(1)); })
            await _enqueueStateChange(EngineStepEndRoll) 

            // computation for gameover, quota completion, and allowing rolls is done in a useEffect below
            setRollsLeft(prevRolls => (prevRolls-1))
        }, 300)
    }

    useEffect(() => {
        if(rollsLeft <= 0 && score < quota)
        {
            console.log("GAME OVER: " + score + " quota = " + quota)
            gameOver()
        }
        else if (score >= quota){
            endRoundAwait()
        }
        else
        {
            setRolling(() => false)
        }
    }, [rollsLeft, score, quota])

    const roundEnding = useRef(false)
    async function endRoundAwait() {
        if(!roundEnding.current)
        {
            roundEnding.current = true
            await _enqueueStateChange(EngineStepEndRound) 
            setRolling(() => false)
            setQuota((quotaPrev) => Math.floor(quotaPrev*1.1) + 1)
            setRollsLeft(() => 3)
            setScore(0)
            completeQuotaFX()
            roundEnding.current = false
        }
    }

    return { rollDice, rolling, diceValues, score, quota, rollsLeft, engineState, hooks: engineHooks}
}