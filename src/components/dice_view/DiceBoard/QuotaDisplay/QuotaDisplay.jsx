import "./QuotaDisplay.css"
import { Progress } from "reactstrap"
import { useIsPortrait } from "./../../../../utilities/useIsPortrait"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    const isPortrait = useIsPortrait()

    let textScale = "[1.5cqi]"
    if(isPortrait)
    {
        textScale = "[2.5cqi]"
    }

    let quotaBarScale = "h-[3cqh]!"
    if(isPortrait)
    {
        quotaBarScale = "h-[2.5cqh]!"
    }

    return (
        <div className="quota-parent @container">
            <div className="quota-row">
                <strong className={"quota-strong text-white text-" + textScale}>Score: {totalDiceScore} </strong>
                <strong className={"quota-strong text-white text-" + textScale}>Required Score: {quotaRequired} </strong>
                <strong className={"quota-strong text-white text-" + textScale}>Rolls Remaining: {rollsLeft}</strong>
            </div>
            <Progress className={"quota-progress " + quotaBarScale} animated="true" value={quotaProgressAmount}/>
        </div>
    )
}