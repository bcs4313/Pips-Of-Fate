import "./Header.css"
import diceImage from "./../../assets/main_layout/dice.png"
import titleImage from "./../../assets/main_layout/title.png"

export default function Header() {
    return (
    <header className="expanded-header">
        <div className="header-div">
            <div className="nav-top flex items-center justify-center">
                <img className="header-img" src={diceImage}/>
                <img className="header-title" src={titleImage}/>
                <img className="header-img" src={diceImage}/>
            </div>
        </div>
    </header>
    )
}