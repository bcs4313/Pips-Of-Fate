import "./DiceBoard.css"
import { Button } from 'reactstrap';
import DiceCard from "./../DiceCard/DiceCard.jsx"
import QuotaDisplay from "./QuotaDisplay/QuotaDisplay.jsx"
import { useGameEngine} from "./../../internal_state/GameEngine.jsx"


export default function DiceBoard() {
    // initialize the dice board
    let diceAmount = 1;

    const {rollDice, rolling, diceValues, score, quota, rollsLeft} = useGameEngine(diceAmount)

    // generate the dice cards
    let diceCards = [];
    for(let i = 0; i < diceValues.length; i++)
    {
        diceCards.push(<DiceCard key={i} rollState={diceValues[i]}/>);
    }

    // return the board layout
    return (
    <div className = "dice-board-main-panel">
        <QuotaDisplay totalDiceScore={score} quotaRequired={quota} rollsLeft={rollsLeft}/>
        <div className="rolling-container">
            <div className="dice-container">
                {diceCards}
            </div>
            <Button onClick={rollDice} active={!rolling} color="primary">Roll</Button>
        </div>
    </div>)
}