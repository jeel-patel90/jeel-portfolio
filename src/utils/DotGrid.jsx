import React, { useRef, useEffect } from "react";

const DotGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const settings = {
      background: "#060818",
      dotSize: 4,
      gap: 18,
      baseColor: "#5227FF",
      activeColor: "#5227FF",
      proximity: 10000,
      shockRadius: 160,
      shockStrength: 5.0,
      maxSpeed: 5000,
      resistance: 750,
      returnDuration: 1.5
    };

    let mouse = { x: 0, y: 0 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.fillStyle = settings.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width; x += settings.gap) {
        for (let y = 0; y < canvas.height; y += settings.gap) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;

          if (dist < settings.proximity) {
            const force =
              (settings.shockRadius - dist) / settings.shockRadius;

            offsetX = dx * force * (settings.shockStrength / 10);
            offsetY = dy * force * (settings.shockStrength / 10);
          }

          ctx.beginPath();
          ctx.arc(
            x + offsetX,
            y + offsetY,
            settings.dotSize,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            dist < settings.proximity
              ? settings.activeColor
              : settings.baseColor;

          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1
      }}
    />
  );
};

export default DotGrid;
