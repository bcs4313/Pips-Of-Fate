import "./QuotaDisplay.css"
import { Progress } from "reactstrap"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    return (
        <>
            <strong>Score: {totalDiceScore} </strong>
            <strong>Required Score: {quotaRequired} </strong>
            <strong>Rolls Remaining: {rollsLeft}</strong>
            <Progress animated="true" value={quotaProgressAmount}/>
        </>
    )
}