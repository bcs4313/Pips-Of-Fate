import "./FloatingItemText.css"

export default function FloatingItemText({ message, color}) {
    function getTextClass() {
        if(color != undefined)
        {
            return "text-floating absolute text-" + color
        }
        else
        {
            return "text-floating absolute text-green-500!"
        }
    }

    return <div className="relative @container text-{color}"><strong className={getTextClass()}>{message}</strong></div>
}