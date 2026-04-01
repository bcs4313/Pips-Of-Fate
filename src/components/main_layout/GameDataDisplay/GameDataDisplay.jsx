import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import radiationIcon from "../../../assets/diceview/DiceCard/RadiationIcon.png"
import frostIcon from "../../../assets/main_layout/GameDataDisplay/FrostIcon.png"
import { Tooltip } from "reactstrap"
import { useState, useRef } from "react"

// displays some important data related to items and upgrades from the shop
// displayed directly above the gold display

export default function GameDataDisplay() {
    const engine = useEngine()
    const statComponents = []

    const [tooltipOpen, setTooltipOpen] = useState(false)
    const toggle = () => setTooltipOpen(!tooltipOpen)

    const idRef = useRef("gamedata-" + "-" + Math.floor(Math.random() * 1000000))

    function generateRadiationIcon() {
        return <div className="w-[5%] flex flex-column bottom-[63%] left-[5%] z-50 hover:cursor-pointer">
        <img className="" src={ radiationIcon }/>
        </div>
    }
    
    function generateFrostIcon() {
        return <div className="w-[5%] flex flex-column bottom-[63%] left-[5%] z-50 hover:cursor-pointer">
        <img className="" src={ frostIcon }/>
        </div>
    }
    

    // remaining freezes data
    if(engine.engineState["freezesBought"] && engine.engineState["freezesBought"] > 0)
    {
        statComponents.push(<div className="ml-[5px] flex flex-row bottom-[130px] w-[50vw] text-start">
        {generateFrostIcon()}
        <strong className="text-blue-200 pl-[8px] content-center">Freezes Remaining: {engine.engineState["remainingFreezes"]}</strong>
        </div>)
    }

    if(engine.engineState["radiationStacks"] && engine.engineState["radiationStacks"] > 0)
    {
        // radiation stack data
        statComponents.push(<div className="ml-[5px] flex flex-row bottom-[130px] w-[50vw] text-start">
        {generateRadiationIcon()}
        <strong id={idRef.current }  className="text-orange-500 pl-[8px] content-center">Radiation Stacks: {engine.engineState["radiationStacks"]}</strong>
        <Tooltip 
        target={idRef.current } 
        placement="top"
        isOpen={tooltipOpen} 
        autohide={true} 
        toggle={toggle}
        className="custom-tooltip-container" // Class for the main container
        innerClassName="custom-tooltip-inner" // Class for the content area
        arrowClassName="custom-tooltip-arrow" // Class for the arrow
        >
            <h4 className="text-orange-500!">Radiation</h4>
            <p>Chance to get a 25% discount on a random attribute upgrade per roll. +1% chance per stack. Discounts stack multiplicatively.</p>
        </Tooltip>
        </div>)
    }

    

    return (<div className="absolute bottom-[105px] flex flex-column">{statComponents}</div>)
}