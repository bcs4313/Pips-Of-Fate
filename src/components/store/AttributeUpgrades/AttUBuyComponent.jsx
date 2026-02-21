import "./AttUBuyComponent.css"
import { Button } from 'reactstrap'

export default function AttUBuyComponent({ imgPath, title, description }) {
    return (
        <div className="purchase-bar">
            <Button className="buy-btn group">
                <img className="att-img group-hover:animate-bounce" src={imgPath} alt="buyicon" />
                <h2 className="att-buy-title">{title}</h2>
                <h5 className="att-buy-desc">{description}</h5>
            </Button>

            <Button className="cost-btn">
                <h2 className="att-cost-text">Cost: $10</h2>
            </Button>
        </div>
    )
}