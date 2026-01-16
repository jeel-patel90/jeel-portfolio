import React, { useRef, useEffect } from 'react';

const PixelBlastBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dots = useRef([]);
  const mouse = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, speed: 0 });
  const settings = {
    dotSize: 4,
    gap: 18,
    baseColor: '#5227FF',
    activeColor: '#5227FF',
    proximity: 150,
    speedTrigger: 100,
    shockRadius: 160,
    shockStrength: 5.00,
    maxSpeed: 5000,
    resistance: 0.98, // Damping factor (0-1)
    returnDuration: 1.5, // seconds
    patternScale: 1.2,
    patternDensity: 0.85,
    patternOpacity: 0.95,
    edgeFade: 0.15,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { innerWidth, innerHeight } = window;
    
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    // Generate dot grid with pattern variations
    const cols = Math.ceil(innerWidth / settings.gap);
    const rows = Math.ceil(innerHeight / settings.gap);
    
    const createDot = (i, j) => {
      // Add subtle pattern variation using noise-like calculations
      const noise = Math.sin(i * 0.3) * Math.cos(j * 0.4) * settings.patternScale;
      const densityFactor = Math.random() < settings.patternDensity ? 1 : 0;
      
      return {
        x: i * settings.gap + noise,
        y: j * settings.gap + noise,
        originalX: i * settings.gap,
        originalY: j * settings.gap,
        vx: 0,
        vy: 0,
        active: false,
        densityFactor,
      };
    };
    
    dots.current = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.current.push(createDot(i, j));
      }
    }

    // Mouse movement handler
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      const dx = mouse.current.x - mouse.current.lastX;
      const dy = mouse.current.y - mouse.current.lastY;
      mouse.current.speed = Math.sqrt(dx * dx + dy * dy);
      
      mouse.current.lastX = mouse.current.x;
      mouse.current.lastY = mouse.current.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#050515');
      gradient.addColorStop(1, '#0a0a20');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.current.forEach(dot => {
        if (!dot.densityFactor) return;
        
        // Calculate distance from mouse
        const dx = mouse.current.x - dot.x;
        const dy = mouse.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply shock effect with smooth easing
        if (distance < settings.proximity && mouse.current.speed > settings.speedTrigger) {
          const force = (settings.proximity - distance) / settings.proximity * settings.shockStrength;
          
          // Smooth acceleration
          dot.vx += dx / distance * force * 0.05;
          dot.vy += dy / distance * force * 0.05;
          
          dot.active = true;
        } else {
          dot.active = false;
        }
        
        // Apply resistance (damping)
        dot.vx *= settings.resistance;
        dot.vy *= settings.resistance;
        
        // Return to original position with smooth easing
        const returnFactor = 0.02 * (1 / settings.returnDuration);
        dot.vx += (dot.originalX - dot.x) * returnFactor;
        dot.vy += (dot.originalY - dot.y) * returnFactor;
        
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        // Edge fade effect
        const edgeDistance = Math.min(
          dot.x / canvas.width,
          (canvas.width - dot.x) / canvas.width,
          dot.y / canvas.height,
          (canvas.height - dot.y) / canvas.height
        );
        const fade = Math.min(1, edgeDistance / settings.edgeFade);
        
        // Draw dot with smooth transitions
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, settings.dotSize * (dot.active ? 1.2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = dot.active 
          ? settings.activeColor 
          : settings.baseColor;
        ctx.globalAlpha = settings.patternOpacity * fade;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        display: 'block', 
        width: '100%', 
        height: '100%', 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1
      }} 
    />
  );
};

export default PixelBlastBackground;