import "./GoldDisplay.css"
import { Progress } from "reactstrap"
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import clsx from 'clsx/lite'
import { useEngine } from "../../internal_state/EngineContextProvider.jsx"

export default function GoldDisplay() {

    const engine = useEngine()

    function GetPercentDiff() {
        const gold = engine.engineState["gold"]
        const lastRoundGold = engine.engineState["lastRoundGold"]

        if(lastRoundGold == 0) { return 0}

        let difference = 0


        if(gold > lastRoundGold)
            return (gold - lastRoundGold) / lastRoundGold
        else
            return -(1 - gold/lastRoundGold)
    }

    function PriceWithDiff(value, diff) {
        return (
            <div className="bg-[var(--bs-secondary)] w-fit h-[100%] flex items-center flex-row gap-[10px] px-[2vw] py-2">
                <NumberFlowGroup>
                    <div>
                        <NumberFlow
                            value={value}
                            className="align-middle text-[var(--bs-yellow)] mb-[1px]"
                        />
                    </div>
                    <div>
                        <strong className="text-[var(--bs-yellow)] align-middle"> Gold: </strong>
                    </div>
                    <div>
                        <NumberFlow
                            value={diff}
                            locales="en-US"
                            format={{ style: 'percent', maximumFractionDigits: 2, signDisplay: 'always' }}
                            className={clsx(
                                '~text-lg/2xl align-middle transition-colors duration-300',
                                diff < 0 ? 'text-red-500' : 'text-emerald-500'
                            )}
                        />
                </div>
                </NumberFlowGroup>
            </div>
        )
    }

    return (
        <div className="@container">
        <div className="text-[clamp(0.5em,10cqw,2.8em)] text-center w-[auto] h-[100px]">
            {PriceWithDiff(engine.engineState["gold"], GetPercentDiff())}
        </div>
        </div>
    )
}