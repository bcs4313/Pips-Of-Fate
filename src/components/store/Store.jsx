import { Button } from 'reactstrap'
import BuyComponent from "./AttributeUpgrades/AttUBuyComponent"
import NavigationBar from "./../main_layout/NavigationBar.jsx"
import "./Store.css"

// basic buy img imports
import ExtraDiceImg from "./../../assets/store/ExtraDiceUpgrade.png"
import FrozenDiceImg from "./../../assets/store/FrozenDiceUpgrade.png"

export default function Store() {
    return (
        <main>
            <div className="store-container overflow-hidden">
                <div className="store-baseupgrades-container">
                    <BuyComponent title="Extra Dice" imgPath={ExtraDiceImg} description="Get an additional die for each roll. 
                    Score higher and trigger items more often!"/>
                    <BuyComponent title="+1 Freeze" imgPath={FrozenDiceImg} description="Freeze a die value for the rest of the round with a checkbox. 
                    Dice can be unfrozen for free."/>
                </div>
            </div>
            <NavigationBar currentLocation="/store"/>
        </main>
    )
}