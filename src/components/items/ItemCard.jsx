
import { assetMap } from "../../utilities/assetMap"

//@param name
//@param stacks
//@param rarity
//@param description
//@param imagePath
//@param activeCallback
export default function ItemCard({name, stacks, rarity, description, imagePath, activeCallback})
{
    return (<>
        <h1>{name}</h1>
        <h1>{stacks}</h1>
        <h1>{rarity}</h1>
        <h1>{description}</h1>
        <img className="object-fill" alt={imagePath} src={assetMap["items/images_unique/" + imagePath]}/>
    </>) 
}