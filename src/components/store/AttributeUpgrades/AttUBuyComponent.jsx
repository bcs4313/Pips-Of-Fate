import "./AttUBuyComponent.css"
import { Button } from 'reactstrap'
import InvalidBuyAudio from "./../../../assets/store/InvalidBuy.mp3"
import { useRef } from "react"
import { useEngine } from "./../../internal_state/EngineContextProvider.jsx"

export default function AttUBuyComponent({ imgPath, price, title, description, upgradefunction}) {
    const InvalidBuySFX = useRef(new Audio(InvalidBuyAudio))
    const engine = useEngine()

    function buyAtt() {
        if(engine.engineState["gold"] >= price)
        {
            upgradefunction(price)
        }
        else
        {
            InvalidBuySFX.current.currentTime = 0
            InvalidBuySFX.current.play()
            console.log("Can't buy upgrade! Price is: " + price)
        }
    }

    return (
        <div className="purchase-bar @container">
            <Button onClick={buyAtt} className="buy-btn group p-0 grid! grid-cols-[100px_30%_auto] duration-0 active:bg-cyan-500!">
                <div className="h-[100px] flex">
                    <img className="att-img group-hover:animate-bounce group-active:animate-bounce h-[70px] self-center ml-[12px]" src={imgPath} alt="buyicon" />
                </div>
                <h2 className="att-buy-title mb-0">{title}</h2>
                <h5 className="att-buy-desc mb-0">{description}</h5>
            </Button>

            <Button onClick={buyAtt} className="cost-btn">
                <h2 className="att-cost-text mb-0">Cost: ${price}</h2>
            </Button>
        </div>
    )
}