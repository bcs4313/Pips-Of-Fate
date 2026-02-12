import "./DiceCard.css"

// dice result imports
import result1 from "../../../assets/diceview/DiceCard/roll-results/dice_result_01.png"
import result2 from "../../../assets/diceview/DiceCard/roll-results/dice_result_02.png"
import result3 from "../../../assets/diceview/DiceCard/roll-results/dice_result_03.png"
import result4 from "../../../assets/diceview/DiceCard/roll-results/dice_result_04.png"
import result5 from "../../../assets/diceview/DiceCard/roll-results/dice_result_05.png"
import result6 from "../../../assets/diceview/DiceCard/roll-results/dice_result_06.png"

// dice animation imports
import rollAnim from "../../../assets/diceview/DiceCard/roll-animation/roll.gif"

// a dice card is the core component of the scoring system
// rollState is an integer that represents what the dice is doing
// 0 = currently animating
// 1-6 = resting on the roll result from 1 to 6
export default function DiceCard({rollState}) {
    
    let imgRef = result1;
    switch(rollState) {
        case 0:
            imgRef = rollAnim;
            break;
        case 1:
            imgRef = result1;
            break;
        case 2:
            imgRef = result2;
            break;
        case 3:
            imgRef = result3;
            break;
        case 4:
            imgRef = result4;
            break;
        case 5:
            imgRef = result5;
            break;
        case 6:
            imgRef = result5;
            break;
        default:
            imgRef = result1;
    }

    return (
    <>
    <div>
        <h1 className="die-num">{rollState}</h1>
        <img className="die" src={imgRef}/>
    </div>
    </>
    )
}