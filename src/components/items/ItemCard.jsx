
import { assetMap } from "../../utilities/assetMap"
import { useState, useRef, useEffect } from "react"
import { Tooltip } from "reactstrap"
import { useUIBus } from "../vfx/UIBusContextProvider"
import { ItemRegistry } from "./ItemRegistry"
import "./ItemCard.css"

// VFX
import FloatingItemText from "./../vfx/item_vfx/FloatingItemText"

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
    const [flashing, setFlashing] = useState(false)
    const [floatingTextComps, setFloatingTextComps] = useState([])
    useEffect(() => {
        // ITEM_FLASH (duration is fixed to 0.25 seconds for now, white)
        //@param { itemID } req
        const flashCallback = (args) => {
            if(args.itemID !== id) { return }
            setFlashing(true)
            setTimeout(() => {
                setFlashing(false)
            }, 250)
        }
        UIBus.subscribe("ITEM_FLASH", flashCallback)

        // ITEM_FLOATINGTEXT a wavy text effect that floats to the top of the screen
        // used to display extra info from an item as it actives
        //@param { itemID } req
        //@param { msg } req
        const floatingCallback = (args) => {
            if(args.itemID !== id) { return }
            addTextComp(args.msg)
        }
        UIBus.subscribe("ITEM_FLOATING_TEXT", floatingCallback)

        // cleanup
        return () => {
            UIBus.unsubscribe("ITEM_FLASH", flashCallback)
            UIBus.unsubscribe("ITEM_FLOATING_TEXT", floatingCallback)
        }
    }, [UIBus])

    
    function addTextComp(msg) {
        setFloatingTextComps((prev) => {
            let newTextComps = [...prev]
            let UIKey = Math.random() * Number.MAX_SAFE_INTEGER
            newTextComps.push(<FloatingItemText message={msg} key={UIKey} />)
            return newTextComps
        })
        setTimeout(() => {
            setFloatingTextComps((prev) => {
                let newArr = [...prev]
                newArr.shift()
                return [...newArr]
            })
        }, 5000)
    }
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
            {floatingTextComps}
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