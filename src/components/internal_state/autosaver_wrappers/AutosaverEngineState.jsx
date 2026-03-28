import { useState, useEffect } from "react"
import { useRoundNumber } from "./AutosaverRoundState.jsx"

// functional model hook that stores your gold in the game
// also exports the total % gold difference from last round
// this hook does NOT allow you to directly set percentdiff, it is private
// for simplicity
export function useEngineState() {

    function saveUpToDate() {
        console.log("saveuptodatecall")
        const savedEngineState = JSON.parse(localStorage.getItem("engineState"))
        const keysNeeded = ["diceValues", "score"]
        const criticalKeys = ["lastRoundGold", "gold", "roundNum", "freezesBought", "remainingFreezes", "frozenDice","rerollPrice","itemOffers","baseRolls","totalUpgradesBought", "flatGoldUpgradesBought"]

        let returnCode = 1
        keysNeeded.forEach((key) => {
            if(savedEngineState[key] == null) 
            {
                returnCode = 0
            }
        })

        criticalKeys.forEach((key) => {
            if(savedEngineState[key] == null) 
            {
                console.log("null key == " + key)
                returnCode = -1
            }
        })
        console.log("up to date = " + returnCode)
        return returnCode
    }

    const [engineState, setEngineState] = useState(() => {
        const savedEngineState = JSON.parse(localStorage.getItem("engineState"))
        const upToDate = saveUpToDate()
        if(savedEngineState != undefined && upToDate != -1) 
        {
            console.log("loading game... state is: " + upToDate)
            console.log(savedEngineState)

            if(upToDate == 0)
            {
                console.log("save out of date! attempting to load old information:")
                const _score = localStorage.getItem("score")
                const _diceValues = localStorage.getItem("diceValues")

                if(_score)
                {
                    savedEngineState["score"] = parseFloat(_score)
                }
                if(_diceValues)
                {
                    savedEngineState["diceValues"] = JSON.parse(_diceValues)
                }
            }

            return savedEngineState
        }
        return {
            lastRoundGold:0,
            gold: 0,
            roundNum: 0,
            freezesBought: 0,
            remainingFreezes: 0,
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

    useEffect(() => {
        localStorage.setItem("engineState", JSON.stringify(engineState))
    }, [engineState])

    return [engineState, setEngineState]
}