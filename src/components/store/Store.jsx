import { Button } from 'reactstrap'
import NavigationBar from "./../main_layout/NavigationBar.jsx"

export default function Store() {
    return (
        <>
        <div className="rolling-container">
            <div className="dice-container">
            </div>
            <Button color="primary">Roll</Button>
        </div>
        <NavigationBar currentLocation="/store"/>
        </>
    )
}