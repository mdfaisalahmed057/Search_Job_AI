"use client"

import { useEffect, useRef } from "react"

export function RoboAnimation() {
  const robotRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!robotRef.current || !glowRef.current) return

    // Animation for floating effect
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = (currentTime - startTime) / 1000

      // Floating animation
      const yOffset = Math.sin(elapsed) * 10
      if (robotRef.current) {
        robotRef.current.style.transform = `translateY(${yOffset}px)`
      }

      // Glow animation
      const glowScale = 1 + Math.sin(elapsed * 0.5) * 0.1
      const glowOpacity = 0.5 + Math.sin(elapsed * 0.5) * 0.3
      if (glowRef.current) {
        glowRef.current.style.transform = `scale(${glowScale})`
        glowRef.current.style.opacity = glowOpacity
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" ref={robotRef}>
          <div ref={glowRef} className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-32 h-32 text-purple-500"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      </div>
    </div>
  )
}

