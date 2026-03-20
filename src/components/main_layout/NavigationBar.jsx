import { Button } from "reactstrap"
import "./NavigationBar.css"
import { useNavigate } from "react-router-dom"
import GoldDisplay from "./GoldDisplay/GoldDisplay.jsx"
import GameDataDisplay from "./GameDataDisplay/GameDataDisplay.jsx"

// @param { string } location : our current Router path
export default function NavigationBar({currentLocation}) {
    const navigate = useNavigate()

    function deleteSave() {
        localStorage.clear()
        location.reload();
    }

    function goto(path) {
        navigate(path)
    }

    function createSecondaryButton() {
        switch(currentLocation)
        {
            case "/store":
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]! text-[clamp(0.4em,1cqmax,5em)]!" onClick={() => goto("/")} color="secondary">Back to Arena</Button>)
                break;
            case "/settings":
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]! text-[clamp(0.4em,1cqmax,5em)]!" onClick={() => goto("/")} color="secondary">Back to Arena</Button>)
                break;
            default:
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]! text-[clamp(0.4em,1cqmax,5em)]!" onClick={() => goto("store")} color="secondary">Shop</Button>)
                break;
        }
    }

    function createSettingsButton() {
        switch(currentLocation)
        {
            case "/store":
                return (<></>)
                break;
            case "/settings":
                return (<></>)
                break;
            default:
                return (<Button className="text-white settings-button h-[60px]! w-[clamp(10px,18vw,300px)]! text-[clamp(0.4em,1cqmax,5em)]!" onClick={() => goto("settings")} color="info">Settings</Button>)
                break;
        }
    }

    return (
    <>
    <nav className="h-[100px] z-1 bg-[var(--bs-light)] grid justify-center grid-cols-[1fr_auto_auto_1fr] @container">
        <GameDataDisplay/>
        <GoldDisplay/>
        {createSecondaryButton()}
        {createSettingsButton()}
        <div></div>
    </nav>
    </>)
}