import "./FloatingItemText.css"

export default function FloatingItemText({ message, color}) {
    if(color == "undefined")
    {
        color = "green"
    }
    
    return <div className="relative @container">
        <strong style={{"color":color}} className="text-floating absolute">{message}</strong>
        </div>
}