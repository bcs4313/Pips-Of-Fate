import "./QuotaDisplay.css"
import { Progress } from "reactstrap"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    return (
        <div className="quota-parent">
            <div className="quota-row">
                <strong className="quota-strong text-white">Score: {totalDiceScore} </strong>
                <strong className="quota-strong text-white">Required Score: {quotaRequired} </strong>
                <strong className="quota-strong text-white">Rolls Remaining: {rollsLeft}</strong>
            </div>
            <Progress className="quota-progress" animated="true" value={quotaProgressAmount}/>
        </div>
    )
}