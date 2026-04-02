import "./AttUBuyComponent.css"
import { Button } from 'reactstrap'
import { useRef } from "react"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"
import { useSoundChannel } from "./../../../utilities/soundManagerProvider.jsx"
import radIcon from "./../../../assets/diceview/DiceCard/RadiationIcon.png"

export default function AttUBuyComponent({ imgPath, price, title, description, upgradefunction}) {
    const engine = useEngine()
    const [load, play] = useSoundChannel()
    load("SuccessfulBuy")
    load("InvalidBuy")

    const discounts = engine.engineState["radiationUpgradeDiscounts"]
    const upgradeDiscountCount = discounts ? discounts["attr-buy-button-" + title] : null

    // create a true price
    let truePrice = price
    if(upgradeDiscountCount)
    {
        truePrice = Math.floor(price*(1-(calculateDiscountPercent(upgradeDiscountCount)/100)))
    }
    

    function calculateDiscountPercent(radStacks) {
        return (1 - (0.5**radStacks))*100
    }

    function generateRadiationIcon() {
        if(upgradeDiscountCount)
        {
            return <div className="w-[15%] flex flex-column absolute bottom-[0%] left-[0%] @container z-50 hover:cursor-pointer">
            <strong className="text-[30cqw] text-orange-400!">{calculateDiscountPercent(upgradeDiscountCount) + "%"}</strong>
            <img className="" src={ radIcon }/>
            </div>
        }
        return <></>
    }
    
    function generateCostTextClass() {
        if(upgradeDiscountCount != null && upgradeDiscountCount > 0)
        {
            return "text-orange-400!"
        }
        else
        {
            return "text-white"
        }
    }

    function buyAtt() {
        if(engine.engineState["gold"] >= truePrice)
        {
            play("SuccessfulBuy")
            upgradefunction(truePrice)
            console.log("Upgrade bought: " + title + " for " + truePrice + " gold")

            if(upgradeDiscountCount)
            {
                engine.hooks["enqueueStateChange"]((_engineState) =>{
                    _engineState["radiationUpgradeDiscounts"]["attr-buy-button-" + title] = 0
                    const newState = {..._engineState}
                    return newState
                })
            }
        }
        else
        {
            play("InvalidBuy")
            console.log("Can't buy upgrade! Price is: " + price)
        }
    }

    return (
        <div className="purchase-bar @container">
            <Button id={"attr-buy-button-" + title} onClick={buyAtt} className="buy-btn group p-0 grid! grid-cols-[100px_30%_auto] duration-0 active:bg-cyan-500!">
                <div className="h-[100px] flex">
                    <img className="att-img group-hover:animate-bounce group-active:animate-bounce h-[70px] self-center ml-[12px]" src={imgPath} alt="buyicon" />
                </div>
                <h2 className="att-buy-title mb-0">{title}</h2>
                <h5 className="att-buy-desc mb-0">{description}</h5>
            </Button>

            <Button onClick={buyAtt} className="cost-btn">
                <h2 className={"att-cost-text mb-0 " + generateCostTextClass()}>Cost: ${truePrice}</h2>
                {generateRadiationIcon()}
            </Button>
        </div>
    )
}