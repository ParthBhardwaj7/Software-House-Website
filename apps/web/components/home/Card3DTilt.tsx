"use client";

import { useRef, useState } from "react";

type Card3DTiltProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card3DTilt({ children, className = "" }: Card3DTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = y * 8;
    const tiltY = -x * 8;
    setTransform(
      `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    );
  }

  function handleLeave() {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
}
