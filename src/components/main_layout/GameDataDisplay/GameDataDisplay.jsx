import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"

// displays some important data related to items and upgrades from the shop
// displayed directly above the gold display

export default function GameDataDisplay() {
    const engine = useEngine()

    if(engine.engineState["freezesBought"] && engine.engineState["freezesBought"] > 0)
    {
    return (<div className="absolute bottom-[130px] w-[50vw] text-start">
    <strong className="absolute text-blue-200 pl-[8px]">Freezes Remaining: {engine.engineState["remainingFreezes"]}</strong>
    </div>)
    }

    return (<div className="absolute"></div>)
}