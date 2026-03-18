import "./QuotaDisplay.css"
import { Progress } from "reactstrap"
import { useIsPortrait } from "./../../../../utilities/useIsPortrait"

export default function QuotaDisplay({totalDiceScore, quotaRequired, rollsLeft}) {

    // scored out of 100 for the progress bar
    const quotaProgressAmount = Math.min((totalDiceScore / quotaRequired) * 100, 100)
    const isPortrait = useIsPortrait()

    let textScale = {"font-size":"3cqh"}
    if(isPortrait)
    {
        textScale = {"font-size":"2.5cqh"}
    }

    let quotaBarScale = "h-[3cqh]!"
    if(isPortrait)
    {
        quotaBarScale = "h-[2.5cqh]!"
    }

    let extraPadding = "quota-row pl-[20%] pr-[20%]"
    if(isPortrait)
    {
        extraPadding = "quota-row pl-[5%] pr-[5%]"
    }

    // there is no good reason as to why the text only accepts direct styling for the text size,
    // but it still works. Do not change it.
    return (
        <div className="quota-parent @container">
            <div className={extraPadding}> 
                <strong style={textScale} className={"quota-strong text-white"}>Score: {totalDiceScore} </strong>
                <strong style={textScale} className={"quota-strong text-white"}>Required Score: {quotaRequired} </strong>
                <strong style={textScale} className={"quota-strong text-white"}>Rolls Remaining: {rollsLeft}</strong>
            </div>
            <Progress className={"quota-progress " + quotaBarScale} animated="true" value={quotaProgressAmount}/>
        </div>
    )
}