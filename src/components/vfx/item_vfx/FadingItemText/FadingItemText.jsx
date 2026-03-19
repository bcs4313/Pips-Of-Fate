import "./FadingItemText.css"

export default function FadingItemText({ message, color}) {
    if(color == "undefined")
    {
        color = "green"
    }

    return <div style={{"color":color}} className="relative @container text-{color}">
        <strong className="text-fading absolute">{message}</strong>
        </div>
}