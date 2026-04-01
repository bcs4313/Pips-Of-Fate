import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import radiationIcon from "../../../assets/diceview/DiceCard/RadiationIcon.png"
import frostIcon from "../../../assets/main_layout/GameDataDisplay/FrostIcon.png"

// displays some important data related to items and upgrades from the shop
// displayed directly above the gold display

export default function GameDataDisplay() {
    const engine = useEngine()
    const statComponents = []

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

    // radiation stack data
    statComponents.push(<div className="ml-[5px] flex flex-row bottom-[130px] w-[50vw] text-start">
    {generateRadiationIcon()}
    <strong className="text-orange-500 pl-[8px] content-center">Radiation Stacks: {engine.engineState["remainingFreezes"]}</strong>
    </div>)

    

    return (<div className="absolute bottom-[105px] flex flex-column">{statComponents}</div>)
}