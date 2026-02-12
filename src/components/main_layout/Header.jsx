import "./Header.css"

export default function Header() {
    return (
    <div className="header-div">
        <nav>
            <img className="header-img" src="src\assets\main_layout\dice.png"/>
            <img className="header-title" src="src\assets\main_layout\title.png"/>
            <img className="header-img" src="src\assets\main_layout\dice.png"/>
        </nav>
        <small>Roll or Get Fired</small>
    </div>
    )
}