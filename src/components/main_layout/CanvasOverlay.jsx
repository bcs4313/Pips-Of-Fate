import { useEffect, useRef, useState} from "react";
import JSConfetti from "js-confetti";
import ParticleRay from "./../vfx/item_vfx/ParticleRay/ParticleRay"
import { useUIBus } from "../vfx/UIBusContextProvider.jsx"
import "./CanvasOverlay.css"

export default function CanvasOverlay() {
    const canvasRef = useRef(null)
    const UIBus = useUIBus()

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Utilize UIBus for calling particle effects
        const rayCallback = (args) => addParticleRay(args)
        UIBus.subscribe("PARTICLE_RAY", rayCallback)
        // end of UI bus subscriptions

        addParticleRay(1, 0.5, 1.25, 50, 100, 100, 500, 500)

        // UI Bus cleanup
        return () => {
            UIBus.unsubscribe("PARTICLE_RAY", rayCallback)
        }
    }, [])

    const [particleEffects, setParticleEffects] = useState([])

    function addParticleRay(_travelTime, _emissionTime, _killTime, _maxParticles, _originX, _originY, _destX, _destY) {
        const ray = <ParticleRay key={Math.random()} travelTime={_travelTime} emissionTime={_emissionTime} killTime={_killTime} maxParticles={_maxParticles} 
        originX={_originX} originY={_originY} destX={_destX} destY={_destY} canvasRef={canvasRef} />
        setParticleEffects((effects) => [...effects, ray])
    }


    return <div>
        {particleEffects}
        <canvas id="GameCanvas" ref={canvasRef} className="overlay-canvas"  />
    </div>
}

export function ConfettiEffect() {
    const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti({
        confettiRadius: 6,
    })
}