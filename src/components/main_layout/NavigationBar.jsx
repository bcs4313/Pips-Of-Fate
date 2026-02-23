import { Button } from "reactstrap"
//import "./NavigationBar.css"
import { useNavigate } from "react-router-dom"
import GoldDisplay from "./GoldDisplay/GoldDisplay.jsx"

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
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]!" onClick={() => goto("/")} color="secondary">Back to Arena</Button>)
                break;
            default:
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]!" onClick={() => goto("store")} color="secondary">Shop</Button>)
                break;
        }
    }

    function createDangerButton() {
        switch(currentLocation)
        {
            case "/store":
                return (<></>)
                break;
            default:
                return (<Button className="h-[60px]! w-[clamp(10px,18vw,300px)]!" onClick={deleteSave} color="danger">Delete Save and Restart</Button>)
                break;
        }
    }

    return (
    <>
    <nav className="h-[100px] bg-[var(--bs-light)] grid justify-center grid-cols-[1fr_auto_auto_1fr]">
        <GoldDisplay/>
        {createSecondaryButton()}
        {createDangerButton()}
        <div></div>
    </nav>
    </>)
}