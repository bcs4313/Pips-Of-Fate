import { useEffect, useRef } from "react";
import JSConfetti from "js-confetti";
import "./CanvasOverlay.css"

export default function CanvasOverlay() {
    const canvasRef = useRef(null)

    // this is weird, I don't fully understand it yet but it works
    useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    //ctx.fillStyle = "red";
    //ctx.fillRect(0, 0, 1920, 1080); 
    }, [])


    return <canvas ref={canvasRef} className="overlay-canvas" />
}

export function ConfettiEffect() {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
    confettiRadius: 6,
    })
}