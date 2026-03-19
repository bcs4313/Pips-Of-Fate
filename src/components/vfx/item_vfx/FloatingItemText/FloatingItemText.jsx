import "./FloatingItemText.css"

export default function FloatingItemText({ message, color}) {
    if(color == "undefined")
    {
        color = "green"
    }

    console.log("color = " + color)
    
    return <div className="relative @container">
        <strong style={{"color":color}} className="text-floating absolute">{message}</strong>
        </div>
}