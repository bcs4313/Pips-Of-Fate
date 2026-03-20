import NavigationBar from "./../main_layout/NavigationBar"
import { useState } from "react"
import "./GameSettings.css"
import { Button } from "reactstrap"
import { useIsPortrait } from "./../../utilities/useIsPortrait"

export default function GameSettings()
{
    const [volumeDisplay, setVolumeDisplay] = useState(50)
    const isPortrait = useIsPortrait()

    function onChangeVolume(e) {
        setVolumeDisplay(e.currentTarget.value)
        e.target.style.setProperty('--value', e.currentTarget.value)
    }

    function deleteSave() {
        localStorage.clear()
        location.assign("/")
    }

    function getTextSizeProps() {
        if(isPortrait)
        {
            return "text-[7cqw]!"
        }
        else
        {
            return "text-[3cqw]!"
        }
    }

    function getSettingWidthProps() {
        if(isPortrait)
        {
            return "w-[90%]"
        }
        else
        {
            return "w-[50%]"
        }
    }

    return (
    <main>
        <div className="background-wrapper">
            <div className="settings-board-background"></div>
        </div>
        <div className="settings-container flex flex-column">
            <div className="setting-container-top">
                <h1 className="mt-[20px]! text-white">Settings</h1>
            </div>
            <div className={"setting-container " + getSettingWidthProps()}>
                <div className="w-[80%]">
                    <div className="setting-singular h-[20%] flex flex-row">
                        <div className="settings-text-container">
                            <label className={"setting-label " + getTextSizeProps()} htmlFor="vol">Game Volume:</label>
                        </div>
                        <div className="settings-text-container">
                        <strong className={getTextSizeProps() + " text-white"}>{volumeDisplay}%</strong>
                        </div>
                    </div>
                    <input onChange={onChangeVolume} type="range" id="vol" name="vol" min="0" max="100"></input>
                </div>
            </div>
            <hr></hr>
            <div className="delete-setting-container flex flex-row">
                {<Button className="h-[60px]! w-[20vw]! text-[clamp(0.4em,1cqmax,5em)]!" onClick={deleteSave} color="danger">Delete Save and Restart</Button>}
            </div>
        </div>
        <NavigationBar currentLocation="/settings"/>
    </main>)
}