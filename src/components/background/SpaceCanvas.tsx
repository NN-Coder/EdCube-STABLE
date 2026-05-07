"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseSpeedY: number;
  baseSpeedX: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 150,
  });
  const enabledRef = useRef(true);
  const animFrameRef = useRef<number>(0);

  const createStar = useCallback((canvas: HTMLCanvasElement, isInitial: boolean): Star => {
    const hue = Math.random();
    let color: string;
    if (hue < 0.2) color = "rgba(180, 220, 255,";
    else if (hue < 0.4) color = "rgba(255, 180, 255,";
    else if (hue < 0.6) color = "rgba(180, 255, 220,";
    else color = "rgba(255, 255, 255,";

    return {
      x: Math.random() * canvas.width,
      y: isInitial ? Math.random() * canvas.height : canvas.height + 10,
      size: Math.random() * 1.2 + 0.3,
      baseSpeedY: (Math.random() * 0.15 + 0.05) * -1,
      baseSpeedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() * 0.15 + 0.05) * -1,
      speedX: (Math.random() - 0.5) * 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      color,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current.radius = Math.max(100, Math.min(canvas.width, canvas.height) * 0.15);
    };

    const setup = () => {
      const count = window.innerWidth < 600 ? 120 : 200;
      starsRef.current = [];
      for (let i = 0; i < count; i++) {
        starsRef.current.push(createStar(canvas, true));
      }
    };

    const animate = () => {
      if (!enabledRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      for (const star of starsRef.current) {
        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            star.x -= (dx / distance) * force * 3;
            star.y -= (dy / distance) * force * 3;
          }
        }

        star.y += star.speedY;
        star.x += star.speedX;

        if (star.y < -10) {
          Object.assign(star, createStar(canvas, false));
        }
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        if (Math.random() > 0.99) star.opacity = Math.random() * 0.8 + 0.2;

        // Draw
        ctx.fillStyle = `${star.color} ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    setup();
    animate();

    const onResize = () => {
      resize();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseOut = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k") {
        enabledRef.current = !enabledRef.current;
        if (enabledRef.current) {
          canvas.style.opacity = "1";
          animate();
        } else {
          canvas.style.opacity = "0";
        }
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [createStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
      style={{ zIndex: -1 }}
    />
  );
}
