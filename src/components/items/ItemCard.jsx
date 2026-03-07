
import { assetMap } from "../../utilities/assetMap"
import { useState, useRef, useEffect } from "react"
import { Tooltip } from "reactstrap"
import { useUIBus } from "./../effects/UIBusContextProvider"
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

    // UI BUS SECTION
    const UIBus = useUIBus()
    // ITEM_FLASH (duration is fixed to 0.25 seconds for now, white)
    const [flashing, setFlashing] = useState(false)
    useEffect(() => {
        UIBus.subscribe("ITEM_FLASH", (args) => {
            if(args.itemID !== id) { return }

            setFlashing(true)
            setTimeout(() => {
                setFlashing(false)
            }, 250)
        })
    }, [UIBus, id])
    // UI BUS SECTION

    function ConstructImgClass() {
        let targetClass = "object-fill w-[clamp(16px,16cqw,128px)]"

        if(flashing)
        {
            targetClass += " flash-element" 
        }

        return targetClass
    }

    function attachStackCount() {
        if(stacks > 1)
        {
            return <h1 className="absolute text-white font-[600]! top-0 right-0">x{stacks}</h1>
        }
        return <></>
    }

    return (
        <div className="relative align-self-center w-[clamp(16px,16cqw,128px)] h-[clamp(16px,16cqw,128px)] inline-block">
            {attachStackCount()}
            <img id={idRef.current } className={ConstructImgClass()} alt={imagePath} src={assetMap["items/images_unique/" + imagePath]}/>
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
        </div>) 
}