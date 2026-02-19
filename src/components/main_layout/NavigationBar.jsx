import { Button } from "reactstrap"
import "./NavigationBar.css"
import { useNavigate } from "react-router-dom"

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
                return (<Button className="dice-nav-button" onClick={() => goto("/")} color="secondary">Back to Arena</Button>)
                break;
            default:
                return (<Button className="dice-nav-button" onClick={() => goto("store")} color="secondary">Shop</Button>)
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
                return (<Button className="dice-nav-button" onClick={deleteSave} color="danger">Delete Save and Restart</Button>)
                break;
        }
    }

    return (<nav className="dice-nav-bar">
        {createSecondaryButton()}
        {createDangerButton()}
    </nav>)
}