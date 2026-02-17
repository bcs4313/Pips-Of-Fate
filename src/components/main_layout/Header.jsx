import "./Header.css"

export default function Header() {
    return (
    <div className="expanded-header">
        <div className="header-div">
            <nav>
                <img className="header-img" src="src\assets\main_layout\dice.png"/>
                <img className="header-title" src="src\assets\main_layout\title.png"/>
                <img className="header-img" src="src\assets\main_layout\dice.png"/>
            </nav>
        </div>
        <small>Roll or Get Fired</small>
    </div>
    )
}