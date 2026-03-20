import NavigationBar from "./../main_layout/NavigationBar"
import "./GameSettings.css"

export default function GameSettings()
{
    return (
    <main>
        <div className="settings-container">
            <form>
            <label for="vol">Game Volume:</label>
                <input type="range" id="vol" name="vol" min="0" max="50"></input>
            </form>
        </div>
        <NavigationBar currentLocation="/"/>
    </main>)
}