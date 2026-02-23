import { useGold } from "../Autosaver_Wrappers/AutosaverEngineState"

export default function EngineStepsModel() {
    const [model, setGold] = useGold()

    return [gold, setGold]
}