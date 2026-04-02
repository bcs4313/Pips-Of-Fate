import { useEffect } from 'react';

// @param canvasRef the reference to the main Canvas object of the game
// @param travelTime { number } time the ray takes to travel to the destination in seconds
// @param maxParticles { number } limitation on particle count
// @param spreadX { number } variance in destination
// @param spreadY { number } variance in destination
// @param emissionTime { number } how long should particles be emitted for? (seconds)
// @param killTime { number } exact time when all particles are removed. The ray will call a function on the canvas parent to destroy itself
export default function ParticleRay({ canvasRef, destroyCallback, travelTime=1, maxParticles=500, spreadX=100, spreadY=100, emissionTime=0.25, killTime=1, originX, originY, destX, destY}) {
  
  useEffect(() => {
    let elapsedTime = 0;
    let lastTime = performance.now();
    let deltaTime = 0
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log(spreadX)

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let markedForDestruction = false

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    class Particle {
      constructor(
        fadeOutPortion = 0.25
      ) 
      {
        this.fromX = originX;
        this.fromY = originY;
        this.toX = destX + (spreadX * Math.random());
        this.toY = destY + (spreadY * Math.random());

        this.x = this.fromX;
        this.y = this.fromY;

        this.size = Math.random() * 3 + 1;
        this.color = `#eb7434`;

        this.t = 0;
        this.duration =travelTime;
        this.fadeOutPortion = fadeOutPortion;

        // Fixed random offsets per particle, not velocity errors
        this.spreadX = (Math.random() - 0.5) * spreadX;
        this.spreadY = (Math.random() - 0.5) * spreadY;

        this.opacity = 1;
        this.dead = false;
      }

      update() {
        this.t += deltaTime / this.duration;
        if (this.t >= 1) {
          this.t = 1;
          this.dead = true;
        }

        const easedT = easeOutCubic(this.t);

        // Main guaranteed path
        const baseX = this.fromX + (this.toX - this.fromX) * easedT;
        const baseY = this.fromY + (this.toY - this.fromY) * easedT;

        // Spread fades away as particle approaches destination
        const spreadFalloff = 1 - easedT;

        this.x = baseX + this.spreadX * spreadFalloff;
        this.y = baseY + this.spreadY * spreadFalloff;

        // Optional opacity fade near the end
        const fadeStart = 1 - this.fadeOutPortion;
        if (this.t > fadeStart) {
          const fadeT = (this.t - fadeStart) / this.fadeOutPortion;
          this.opacity = 1 - fadeT;
        } else {
          this.opacity = 1;
        }
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
      const now = performance.now();
      deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;
      elapsedTime += deltaTime;
      const shouldStopEmission = elapsedTime > emissionTime;
      const shouldKill = elapsedTime > killTime;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      const timeNow = new Date()

      if (particles.length < maxParticles && !shouldStopEmission) {
        particles.push(new Particle(0.25));
      }

      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return (!p.dead || p.opacity > 0) && !shouldKill
      });

      if (shouldKill && particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrameId);
        if(destroyCallback != undefined)
        {
          destroyCallback()
        }
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);

  return null;
}