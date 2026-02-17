import "./WebsiteMain.css"
import DiceBoard from './../dice_view/DiceBoard/DiceBoard.jsx'
import NavigationBar from "./NavigationBar.jsx"

export default function WebsiteMain() {
    return (
        <main>
            <NavigationBar />
            <DiceBoard/>
        </main>
    )
}