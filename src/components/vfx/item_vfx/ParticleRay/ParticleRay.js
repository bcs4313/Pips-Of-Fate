import React, { useRef, useEffect } from 'react';

const ParticleRay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const maxParticles = 50;

    class Particle {
      constructor() {
        this.x = canvas.width / 2; // Center emission
        this.y = canvas.height / 2;
        this.size = Math.random() * 3 + 1;
        // Directional velocity (ray effect)
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * -10 - 2; // Mostly upward
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`; // Blue/Cyan
        this.opacity = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1; // Gravity
        this.opacity -= 0.015; // Fade out
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      // Create trails by painting semi-transparent black
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Manage particles
      if (particles.length < maxParticles) {
        particles.push(new Particle());
      }

      particles.forEach((p, index) => {
        p.update();
        p.draw();
        // Remove old particles
        if (p.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', background: 'black' }} />;
};

export default ParticleRay;