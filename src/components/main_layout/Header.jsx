import "./Header.css"

export default function Header() {
    return (
    <div>
        <nav>
            <img src="src\assets\main_layout\dice.png"/>
            <img className="title" src="src\assets\main_layout\title.png"/>
            <img src="src\assets\main_layout\dice.png"/>
        </nav>
        <small>Roll or Get Fired</small>
    </div>
    )
}