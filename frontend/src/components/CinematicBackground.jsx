import React, { useEffect, useRef } from 'react';

export default function CinematicBackground({ intensity = 'subtle' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle field with light cyan tones
    const particleCount = intensity === 'dramatic' ? 65 : 35;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // Telemetry data streams
    const streamCount = intensity === 'dramatic' ? 4 : 2;
    const streams = [];
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 180 + 90,
        speed: Math.random() * 1.4 + 0.6,
        opacity: Math.random() * 0.25 + 0.1
      });
    }

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Clean technical grid on white background
      ctx.save();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Animated particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(2, 132, 199, ${p.alpha * (intensity === 'dramatic' ? 0.7 : 0.4)})`;
        ctx.fill();
      });

      // 3. Flowing data lines
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > height + s.length) {
          s.y = -s.length;
          s.x = Math.random() * width;
        }

        const gradient = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0)');
        gradient.addColorStop(1, `rgba(14, 165, 233, ${s.opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.length);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      });

      // 4. Subtle tactical radar sweep
      if (intensity === 'dramatic') {
        const radarCenterX = width * 0.88;
        const radarCenterY = height * 0.22;
        const radarRadius = 160;

        ctx.save();
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, radarRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        radarAngle += 0.012;
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.arc(radarCenterX, radarCenterY, radarRadius, radarAngle, radarAngle + 0.35);
        ctx.closePath();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.05)';
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
      {/* Ambient gradient backdrops with light aero sky hues */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-sky-200/35 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-10 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px]" />

      {/* Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Craft 1: Astraeus-X (Wide Panoramic Patrol across Upper & Center Screen) */}
      <div
        className={`absolute top-6 right-2 md:right-12 w-[540px] md:w-[780px] lg:w-[940px] transition-opacity duration-1000 ${
          intensity === 'dramatic' ? 'opacity-30' : 'opacity-16'
        }`}
      >
        <div className="relative animate-flight-alpha">
          {/* Tactical Target Vectors & HUD Brackets */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-sky-500/60" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-sky-500/60" />

          {/* Spacecraft Image */}
          <img
            src="/spacecraft.jpg"
            alt="AIR POWER Spacecraft Astraeus-X"
            className="w-full h-auto rounded-3xl shadow-[0_20px_50px_-5px_rgba(14,165,233,0.25)] border border-sky-400/30 object-cover"
          />

          {/* Engine Exhaust Plasma Pulse */}
          <div className="absolute -bottom-2 right-16 w-36 h-8 bg-gradient-to-r from-cyan-400 to-transparent blur-md rounded-full animate-plasma-thrust pointer-events-none" />

          {/* Micro HUD Telemetry Badge */}
          <div className="absolute bottom-4 left-5 px-2.5 py-1 rounded bg-white/85 backdrop-blur-md border border-sky-400/40 shadow-xs flex items-center space-x-1.5 text-[10px] font-mono text-sky-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>ASTRAEUS-X // PATROL LEADER [ORBITAL]</span>
          </div>
        </div>
      </div>

      {/* Craft 2: SF-97 Stealth Interceptor (Wide Panoramic Patrol across Lower & Left Screen) */}
      <div
        className={`absolute bottom-4 left-2 md:left-12 w-[520px] md:w-[740px] lg:w-[900px] transition-opacity duration-1000 ${
          intensity === 'dramatic' ? 'opacity-26' : 'opacity-14'
        }`}
      >
        <div className="relative animate-flight-beta">
          {/* Tactical Target Vectors & HUD Brackets */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-500/60" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-500/60" />

          {/* Second Jet Image */}
          <img
            src="/spacecraft_2.jpg"
            alt="AIR POWER Jet SF-97 Interceptor"
            className="w-full h-auto rounded-3xl shadow-[0_20px_50px_-5px_rgba(6,182,212,0.25)] border border-cyan-400/30 object-cover"
          />

          {/* Engine Exhaust Dual Afterburners Pulse */}
          <div className="absolute bottom-8 -left-4 w-40 h-8 bg-gradient-to-l from-cyan-400 to-transparent blur-md rounded-full animate-plasma-thrust pointer-events-none" />

          {/* Micro HUD Telemetry Badge */}
          <div className="absolute top-4 right-5 px-2.5 py-1 rounded bg-white/85 backdrop-blur-md border border-cyan-400/40 shadow-xs flex items-center space-x-1.5 text-[10px] font-mono text-cyan-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span>SF-97 INTERCEPTOR // WINGMAN [MACH 3.8]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
