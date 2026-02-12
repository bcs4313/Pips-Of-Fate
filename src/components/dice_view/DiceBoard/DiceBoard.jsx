import "./DiceBoard.css"
import { Button } from 'reactstrap';

export default function DiceBoard(props) {
    return (
    <div className = "dice-board-main-panel">
        <div className="rolling-container">
            <div className="dice-container">
                <div class="card dice-card">
                </div>
                <div class="card dice-card">
                </div>
                <div class="card dice-card">
                </div>
            </div>
            <Button color="primary">Roll</Button>
        </div>
    </div>)
}