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
        const rayCallback = (args) => addParticleRay(args.travelTime, args.emissionTime, args.killTime, args.maxParticles, args.originX, args.originY, args.destX, args.destY, args.spreadX, args.spreadY)
        UIBus.subscribe("PARTICLE_RAY", rayCallback)
        // end of UI bus subscriptions

        // UI Bus cleanup
        return () => {
            UIBus.unsubscribe("PARTICLE_RAY", rayCallback)
        }
    }, [])

    const [particleEffects, setParticleEffects] = useState([])

    function destroyParticleCallback(_key) {
        let removeIndex = -1
        for(let i = 0; i < particleEffects.length; i++)
        {
            const particleObj = particleEffects[i]
            if(particleObj.key == _key)
            {
                removeIndex = i
            }
        }
        if(removeIndex == -1)
        {
            console.error("Index for destroying particle missing! This will cause a data leak!")
        }
        else
        {
            particleEffects.splice(removeIndex, 1)
        }
    }

    function addParticleRay(_travelTime, _emissionTime, _killTime, _maxParticles, _originX, _originY, _destX, _destY, _spreadX, _spreadY) {
        console.log("add particle ray")
        const particleKey = Math.random()
        const ray = <ParticleRay key={particleKey} destroyCallback={(particleKey) => destroyParticleCallback(particleKey)} travelTime={_travelTime} emissionTime={_emissionTime} killTime={_killTime} maxParticles={_maxParticles} 
        originX={_originX} originY={_originY} destX={_destX} destY={_destY} canvasRef={canvasRef} spreadX={_spreadX} spreadY={_spreadY}/>
        setParticleEffects((effects) => [...effects, ray])
    }

    console.log(particleEffects)

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