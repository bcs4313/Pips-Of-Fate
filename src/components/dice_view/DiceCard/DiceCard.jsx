import "./DiceCard.css"
import { useState, useRef } from "react"
import { useUIBus } from "../../effects/UIBusContextProvider"

// dice result imports
import result1 from "../../../assets/diceview/DiceCard/roll-results/dice_result_01.png"
import result2 from "../../../assets/diceview/DiceCard/roll-results/dice_result_02.png"
import result3 from "../../../assets/diceview/DiceCard/roll-results/dice_result_03.png"
import result4 from "../../../assets/diceview/DiceCard/roll-results/dice_result_04.png"
import result5 from "../../../assets/diceview/DiceCard/roll-results/dice_result_05.png"
import result6 from "../../../assets/diceview/DiceCard/roll-results/dice_result_06.png"

// dice animation imports
import rollAnim from "../../../assets/diceview/DiceCard/roll-animation/roll.gif"

// sound imports
import FreezeSound from "../../../assets/diceview/DiceCard/FreezeSound.mp3"
import UnFreezeSound from "../../../assets/diceview/DiceCard/UnFreezeSound.mp3"
import InvalidFreezeSound from "../../../assets/diceview/DiceCard/InvalidFreeze.mp3"

// icon imports
import freezeIcon from "../../../assets/diceview/DiceCard/FreezeIcon.png"

// visual status imports
import freezeOverlay from "../../../assets/diceview/DiceCard/FreezeOverlay.png"

// engine link
import { useEngine } from "../../internal_state/EngineContextProvider"

// a dice card is the core component of the scoring system
//@param rollState is an integer that represents what the dice is doing
// 0 = currently animating
// 1-6 = resting on the roll result from 1 to 6
//@param {boolean} freezable attaches a icon to the die that makes it freeze and unfreeze
//@param position {number} an integer that indicates where the die is positioned on the board
export default function DiceCard({rollState, diePosition}) {
    const engine = useEngine()
    const UIBus = useUIBus()
    const freezeAudioRef = useRef(new Audio(FreezeSound))
    const unfreezeAudioRef = useRef(new Audio(UnFreezeSound))
    const invalidFreezeAudioRef = useRef(new Audio(InvalidFreezeSound))


    // ALL VISUAL FX SECTION (Must subscribe to UIBus)

    // DIE_FLASH (duration is fixed to 0.25 seconds for now, white)
    // arguments:
    // dice: { list } a list of dice to flash
    // color { hex } (optional, default is green)
    const [flashing, setFlashing] = useState(false)
    UIBus.subscribe("DIE_FLASH", (args) => {
        if(!args.dice.includes(diePosition)) { return }
        //const element = ref.current  
        //const color = "#49e819"
        //element.style.setProperty("--flash-color", color)

        setFlashing(true)
        setTimeout(() => {
            setFlashing(false)
        }, 250)
    })

    function ConstructImgClass() {
        let targetClass = "die"

        if(flashing)
        {
            targetClass += " flash-element" 
        }

        return targetClass
    }

    // END OF VISUAL FX SECTION

    // FREEZE SECTION
    const freezable = engine.engineState["freezesBought"] > 0 && engine.rollsLeft < 3 && (engine.engineState["remainingFreezes"] > 0 || engine.engineState["frozenDice"].includes(diePosition))

    function freezeDice() {
        console.log("Freeze Dice Call")
        
        engine.hooks["enqueueStateChange"](function(ENGINE_STATE, INVENTORY_INTERFACE, HOOKS) {            
            const frozenDiceList = ENGINE_STATE["frozenDice"]
            let newDieList = [...frozenDiceList]
            
            if(frozenDiceList && frozenDiceList.includes(diePosition))
            {   // case where you are unfreezing a die
                const index = newDieList.indexOf(diePosition)
                newDieList = frozenDiceList.filter(num => num !== diePosition)
                const newState = {...ENGINE_STATE, frozenDice:newDieList}
                unfreezeAudioRef.current.currentTime = 0
                unfreezeAudioRef.current.play()
                return newState
            }
            else // case where you are trying to freeze a die
            {
                // first check if you even have a freeze to spend
                if(ENGINE_STATE["remainingFreezes"] <= 0)
                {
                    invalidFreezeAudioRef.current.currentTime = 0
                    invalidFreezeAudioRef.current.play()
                    return
                }

                newDieList = newDieList.concat(diePosition)
                const newState = {...ENGINE_STATE, frozenDice:newDieList, remainingFreezes: ENGINE_STATE["remainingFreezes"]-1}

                freezeAudioRef.current.currentTime = 0
                freezeAudioRef.current.play()

                return newState
            }
        })
    }

    function dieIsFrozen() {
        const frozenDiceList = engine.engineState["frozenDice"]
        return frozenDiceList && frozenDiceList.includes(diePosition)
    }

    function generateFreezeButton() {
        if(freezable)
        {
            return <img onClick={ freezeDice } className="w-[32px] ml-[105px] mt-[8px] border-2 rounded-xl border-cyan-400 absolute z-50 hover:cursor-pointer" src={ freezeIcon }/>
        }
        return <div className="absolute"/>
    }

    function generateFreezeOverlay() {
        if(dieIsFrozen())
        {
            return <img className="die absolute object-fill z-10" src={freezeOverlay}/>
        }
        return <div className="absolute"/>
    }
    // END OF FREEZE SECTION

    // Image reference and return section:::
    let imgRef = result1;
    switch(rollState) {
        case 0:
            imgRef = rollAnim;
            break;
        case 1:
            imgRef = result1;
            break;
        case 2:
            imgRef = result2;
            break;
        case 3:
            imgRef = result3;
            break;
        case 4:
            imgRef = result4;
            break;
        case 5:
            imgRef = result5;
            break;
        case 6:
            imgRef = result6;
            break;
        default:
            imgRef = result1;
    }

    return (
    <>
    <div>
        <h1 className="die-num">{rollState}</h1>
        { generateFreezeButton() }
        { generateFreezeOverlay() }
        <img className={ConstructImgClass()} src={imgRef}/>
    </div>
    </>
    )
}