import "./QuotaDisplay.css"
import { Progress } from "reactstrap"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    return (
        <div className="quota-parent">
            <div className="quota-row">
                <strong className="quota-strong">Score: {totalDiceScore} </strong>
                <strong className="quota-strong">Required Score: {quotaRequired} </strong>
                <strong className="quota-strong">Rolls Remaining: {rollsLeft}</strong>
            </div>
            <Progress class="quota-progress" animated="true" value={quotaProgressAmount}/>
        </div>
    )
}