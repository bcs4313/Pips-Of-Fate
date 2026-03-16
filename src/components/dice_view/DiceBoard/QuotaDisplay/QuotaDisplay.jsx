import "./QuotaDisplay.css"
import { Progress } from "reactstrap"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    return (
        <div className="quota-parent @container">
            <div className="quota-row">
                <strong className="quota-strong text-white text-[1.5cqi]">Score: {totalDiceScore} </strong>
                <strong className="quota-strong text-white text-[1.5cqi]">Required Score: {quotaRequired} </strong>
                <strong className="quota-strong text-white text-[1.5cqi]">Rolls Remaining: {rollsLeft}</strong>
            </div>
            <Progress className="quota-progress" animated="true" value={quotaProgressAmount}/>
        </div>
    )
}