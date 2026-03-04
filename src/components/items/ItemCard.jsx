
import { assetMap } from "../../utilities/assetMap"
import { useState, useRef } from "react"
import { Tooltip } from "reactstrap"
import "./ItemCard.css"

//@param name
//@param stacks
//@param rarity
//@param description
//@param imagePath
//@param activeCallback
export default function ItemCard({id, name, stacks, rarity, description, imagePath, tooltipDirection, activeCallback})
{
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const toggle = () => setTooltipOpen(!tooltipOpen)

    const idRef = useRef("itemicon-" + id + "-" + Math.floor(Math.random() * 1000000))

    return (<>
        <div className="relative align-self-center">
            <img id={idRef.current } className="object-fill w-[128px]" alt={imagePath} src={assetMap["items/images_unique/" + imagePath]}/>
            <Tooltip 
            target={idRef.current } 
            placement={tooltipDirection}
            isOpen={tooltipOpen} 
            autohide={true} 
            toggle={toggle}
            className="custom-tooltip-container" // Class for the main container
            innerClassName="custom-tooltip-inner" // Class for the content area
            arrowClassName="custom-tooltip-arrow" // Class for the arrow
            >
                <h4>{name}</h4>
                <p>{description}</p>
            </Tooltip>
        </div>
    </>) 
}