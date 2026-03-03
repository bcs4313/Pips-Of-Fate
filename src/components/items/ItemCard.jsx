
import { assetMap } from "../../utilities/assetMap"
import { useState } from "react"
import { Tooltip } from "reactstrap"
import "./ItemCard.css"

//@param name
//@param stacks
//@param rarity
//@param description
//@param imagePath
//@param activeCallback
export default function ItemCard({id, name, stacks, rarity, description, imagePath, activeCallback})
{
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const toggle = () => setTooltipOpen(!tooltipOpen)

    const idStr = "itemicon-" + id

    return (<>
        <div className="relative">
            <img id={idStr} className="object-fill w-[128px]" alt={imagePath} src={assetMap["items/images_unique/" + imagePath]}/>
            <Tooltip 
            target={idStr} 
            placement="right" 
            isOpen={tooltipOpen} 
            autohide={false} 
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