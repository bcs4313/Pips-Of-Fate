import { Button } from "reactstrap"
import "./NavigationBar.css"
export default function NavigationBar() {
    return (<nav className="dice-nav-bar">
        <Button className="dice-nav-button" color="secondary">Shop</Button>
        <Button className="dice-nav-button" color="danger">Delete Save and Restart</Button>
    </nav>)
}