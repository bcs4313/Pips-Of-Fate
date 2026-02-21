import "./AttUBuyComponent.css"
import { Button } from 'reactstrap'

export default function AttUBuyComponent({ imgPath, title, description }) {
    return (
        <div className="purchase-bar @container">
            <Button className="buy-btn group p-0 grid! grid-cols-[100px_30%_auto]">
                <div className="h-[100px] flex">
                    <img className="att-img group-hover:animate-bounce group-active:animate-bounce h-[70px] self-center ml-[12px]" src={imgPath} alt="buyicon" />
                </div>
                <h2 className="att-buy-title mb-0">{title}</h2>
                <h5 className="att-buy-desc mb-0">{description}</h5>
            </Button>

            <Button className="cost-btn">
                <h2 className="att-cost-text mb-0">Cost: $10</h2>
            </Button>
        </div>
    )
}