/**
 * MouseGlow - Subtle white radial gradient that follows the mouse cursor
 * Desktop-only (disabled on screens < 768px)
 */
import React, { useEffect, useState } from "react";

export const MouseGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable on small screens
    const mq = window.matchMedia("(max-width: 768px)");
    const updateEnabled = () => setEnabled(!mq.matches);
    updateEnabled();
    mq.addEventListener("change", updateEnabled);
    return () => mq.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-150"
      style={{
        background: `radial-gradient(320px at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.08), transparent 65%)`,
      }}
    />
  );
};

export default MouseGlow;

