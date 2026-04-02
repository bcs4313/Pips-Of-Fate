import { useQuota, useScore, useRollsLeft, useDiceAmount } from "./autosaver_wrappers/AutosaverRoundState.jsx"
import { useEngineState } from "./autosaver_wrappers/AutosaverEngineState.jsx"
import { useRef, useState, useEffect } from "react"
import { ConfettiEffect } from "../main_layout/CanvasOverlay.jsx"

// inventory import
import { useInventory } from "./../items/InventoryContextProvider.jsx"

// UIBus import
import { useUIBus } from "../vfx/UIBusContextProvider.jsx"

// round step imports
import EngineStepStartRoll from "./engine_steps/EngineStepStartRoll.jsx"
import EngineStepPreRollResults from "./engine_steps/EngineStepPreRollResults.jsx"
import EngineStepPostRollResults from "./engine_steps/EngineStepPostRollResults.jsx"
import EngineStepEndRoll from "./engine_steps/EngineStepEndRoll.jsx"
import EngineStepEndRound from "./engine_steps/EngineStepEndRound.jsx"

import { useSoundChannel } from "./../../utilities/soundManagerProvider.jsx"

// The game engine consumes item activations and
// the roll function from the dice board
// @param {number} diceAmount the amount of dice to use in this roll
export function useGameEngine() {
    // saved in storage via internal_state/Round_State
    const [diceAmount, setDiceAmount] = useDiceAmount()
    const [quota, setQuota ] = useQuota()
    const [rollsLeft, setRollsLeft ] = useRollsLeft()

    // local variables
    const [rolling, setRolling] = useState(false);

    // engine steps and model
    const [engineState, setEngineState] = useEngineState()

    // inventory
    const InventoryInterface = useInventory()

    // UI Bus
    const UIBus = useUIBus()

    // sound
    const [load, play] = useSoundChannel()
    load("RollStart")
    load("RollFinish")
    load("CompleteQuota")
    load("GameOver")

    // hooks
    const engineHooks = {
        "getDiceAmount": _getDiceAmount,
        "setDiceAmount": _setDiceAmount, // not queue enforced
        "setRolling": _setRolling, // not queue enforced
        "getDiceValues": _getDiceValues,
        "setDiceValues": _setDiceValues, // queue only
        "getRollsLeft":_getRollsLeft,
        "addScore": _addScore, // queue only
        "getScore": _getScore,
        "addRolls": _addRolls,
        "forceGameOver": _forceGameOver,
        "getUIBus": _getUIBus,
        "enqueueStateChange": _enqueueStateChange,
        "playSound": _playSound,
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

    // your stateful function can include 3 arguments,
    // engineState, inventoryInterface, hooks
    // it MUST return the engineState
    async function _enqueueStateChange(stepFn) {
        return new Promise((resolve, reject) => {

            // push a wrapped function instead of raw step
            stateQueue.current.push(async (state) => {
                try {
                    const newState = await stepFn(state, InventoryInterface, engineHooks)
                    resolve(newState)
                    return newState
                } catch (err) {
                    reject(err)
                    throw err
                }
            })

            if (engineRunning.current) return

            engineRunning.current = true

            ;(async () => {
                let state = engineStateRef.current

                while (stateQueue.current.length > 0) {
                    const step = stateQueue.current.shift()
                    state = await step(state)
                    setEngineState(() => state)
                }

                engineRunning.current = false
            })()
        })
    }
    // end of queue system //

    // useEffect reacting to a dice amount change
    useEffect(() => {
        //console.log("Engine reacting to diceAmount:", diceAmount)
        
        let newDiceValues = Array(diceAmount).fill(1)
        for(let i = 0; i < engineState.diceValues.length; i++)
        {
            if(i < newDiceValues.length)
            {
                newDiceValues[i] = engineState.diceValues[i]
            }
        }

        engineState.diceValues = newDiceValues
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
        return engineState.diceValues
    }

    // hook
    function _addRolls(val) {
        setRollsLeft((prev) => {
            return prev + val
        })
    }

        // hook
    function _getRollsLeft() {
        return rollsLeft
    }


    // hook
    function _forceGameOver() {
        gameOver()
    }

    // hook
    function _playSound(audioName) {
        play(audioName)
    }

    // hook
    // utilizes a parallel list
    //@param indexes { list } target die indexes to change
    //@param values { list } target values to set
    async function _setDiceValues(indexes, values) {
        await _enqueueStateChange((_engineState) => {
            console.log(engineState.diceValues)
            let prev = [...engineState.diceValues]
            let newDiceValues = [...prev]
            for(let i = 0; i < indexes.length; i++)
            {
                newDiceValues[indexes[i]] = values[i]
            }
            return {...engineState, diceValues:newDiceValues}
        })
    }

    // hook
    function _addScore(val) {
        _enqueueStateChange((engineState) => {
            return {...engineState, score:engineState.score+val}
        })
    }

    // hook
    function _getScore() {
        return engineState.score
    }


    function completeQuotaFX() {
        ConfettiEffect()
        play("CompleteQuota")
    }

    function gameOver() {
        setRolling(() => true)
        setRollsLeft(() => 0)
        play("GameOver")
        setTimeout(function() {
            InventoryInterface.clear()
            setRolling(() => false)
            setQuota(() => 5)
            setRollsLeft(() => engineState.baseRolls)
            setDiceAmount(() => 1)
            localStorage.setItem("itemOffers", [])
            setEngineState(() => {
                return {
                    lastRoundGold:0,
                    gold: 0,
                    roundNum: 0,
                    freezesBought: 0,
                    remainingFreezes:0,
                    frozenDice: [],
                    rerollPrice:5,
                    itemOffers:[],
                    baseRolls:3,
                    totalUpgradesBought:0,
                    flatGoldUpgradesBought:0,
                    diceValues:[1],
                    score:0,
                }
            })
        }, 4000) 
    }

    async function rollDice() {
        // roll animation phase
        if(rolling) { return }

        console.log("roll")
        await _enqueueStateChange(EngineStepStartRoll) 

        let diceAnimArr = []
        for(let i = 0; i < diceAmount; i++)
        {
            // frozen dice case
            if(engineState.frozenDice && engineState.frozenDice.includes(i))
            {
                diceAnimArr.push(engineState.diceValues[i]);
            }
            else
            {
                // unfrozen dice case
                diceAnimArr.push(0);
            }
        }
        await _enqueueStateChange((engineState) => {
            return {...engineState, diceValues:diceAnimArr}
        })
        setRolling(() => true)
        play("RollStart")

        // roll completion
        setTimeout(async function() {
            play("RollFinish")
            //console.log("animation done")
            let newDiceValues = []
            for(let i = 0; i < diceAmount; i++)
            {
                // frozen dice case
                if(engineState.frozenDice && engineState.frozenDice.includes(i))
                {
                    newDiceValues.push(engineState.diceValues[i]);
                }
                else
                {
                    // unfrozen dice case
                    newDiceValues.push(Math.floor(Math.random() * 6) + 1);  // 0 to 6\
                }
            }

            await _enqueueStateChange(EngineStepPreRollResults) 

            await _enqueueStateChange((engineState) => {
                return {...engineState, diceValues:newDiceValues}
            })
            awaitPreRollEngineStep.current = true
        }, 300)
    }

    const resolutionsRemaining = useRef(0) // used to force the engine to await any changes made via hooks or queue
    const awaitEndRollEngineStep  = useRef(false)
    const awaitPreRollEngineStep = useRef(false)

    // for post roll results
    useEffect(() => {
        if(awaitPreRollEngineStep.current)
        {
            ScoringStep()
            awaitPreRollEngineStep.current = false
        }
    }, [engineState.diceValues])

    async function ScoringStep() {
        await _enqueueStateChange(EngineStepPostRollResults) 

        await _enqueueStateChange((engineState) => {
            // update score
            const rollSum = engineState.diceValues.reduce((a,b)=>a+b,0);
            engineState.score = engineState.score + rollSum
            awaitEndRollEngineStep.current = true

            // computation for gameover, quota completion, and allowing rolls is done in a useEffect below
            setRollsLeft(prevRolls => (prevRolls-1))
            return {...engineState}
        })
    }

    useEffect(() => {
        if(rollsLeft <= 0 && engineState.score < quota)
        {
            console.log("GAME OVER: " + engineState.score +  " quota = " + quota)
            gameOver()
        }
        else if (engineState.score >= quota && !roundEnding.current) {
            setRolling(() => true)
            roundEnding.current = true
            setTimeout(() => {
                endRoundAwait()
            }, 500)
        }
        else
        {
            setRolling(() => false)
        }

        // end roll call
        if(awaitEndRollEngineStep.current == true)
        {
            awaitEndRollEngineStep.current = false
            _enqueueStateChange(EngineStepEndRoll) 
        }
    }, [rollsLeft, engineState.score, quota])

    const roundEnding = useRef(false)
    async function endRoundAwait() {
        await _enqueueStateChange(EngineStepEndRound) 
        setQuota((quotaPrev) => Math.floor(quotaPrev*1.1) + 1)
        setRollsLeft(() => engineState.baseRolls)
        completeQuotaFX()
        setRolling(() => false)
        roundEnding.current = false
    }

    return { rollDice, rolling, quota, rollsLeft, engineState, hooks: engineHooks}
}