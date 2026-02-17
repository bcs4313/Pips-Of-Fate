import { Button } from "reactstrap"
import "./NavigationBar.css"
export default function NavigationBar() {
    function deleteSave() {
        localStorage.clear()
        location.reload();
    }

    return (<nav className="dice-nav-bar">
        <Button className="dice-nav-button" color="secondary">Shop</Button>
        <Button className="dice-nav-button" onClick={deleteSave} color="danger">Delete Save and Restart</Button>
    </nav>)
}