import "./WebsiteMain.css"
import DiceBoard from './../dice_view/DiceBoard/DiceBoard.jsx'
import NavigationBar from "./NavigationBar.jsx"
import CanvasOverlay from "./CanvasOverlay.jsx"

export default function WebsiteMain() {
    return (
        <main>
            <DiceBoard/>
            <NavigationBar />
            <CanvasOverlay/>
        </main>
    )
}