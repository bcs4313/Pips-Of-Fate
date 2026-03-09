import "./FloatingItemText.css"

export default function FloatingItemText({ message }) {
    return <div className="relative @container"><strong className="text-floating absolute" >{message}</strong></div>
}