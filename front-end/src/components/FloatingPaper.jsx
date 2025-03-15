"use client"

import { useEffect, useState } from "react"

export function FloatingPaper({ count = 5 }) {
  const [papers, setPapers] = useState([])
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Create initial paper positions
    const initialPapers = Array.from({ length: count }).map((_, index) => ({
      id: index,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      rotation: Math.random() * 360,
      speed: 0.5 + Math.random() * 0.5,
      direction: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    }))

    setPapers(initialPapers)

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    const animatePapers = () => {
      setPapers((prevPapers) =>
        prevPapers.map((paper) => {
          // Calculate new position
          let newX = paper.x + Math.cos(paper.direction) * paper.speed
          let newY = paper.y + Math.sin(paper.direction) * paper.speed
          let newDirection = paper.direction

          // Bounce off edges
          if (newX < 0 || newX > dimensions.width) {
            newDirection = Math.PI - newDirection
            newX = Math.max(0, Math.min(newX, dimensions.width))
          }

          if (newY < 0 || newY > dimensions.height) {
            newDirection = -newDirection
            newY = Math.max(0, Math.min(newY, dimensions.height))
          }

          // Occasionally change direction randomly
          if (Math.random() < 0.01) {
            newDirection = Math.random() * Math.PI * 2
          }

          return {
            ...paper,
            x: newX,
            y: newY,
            rotation: (paper.rotation + paper.rotationSpeed) % 360,
            direction: newDirection,
          }
        }),
      )
    }

    window.addEventListener("resize", handleResize)

    const intervalId = setInterval(animatePapers, 50)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(intervalId)
    }
  }, [count, dimensions.width, dimensions.height])

  return (
    <div className="relative w-full h-full">
      {papers.map((paper) => (
        <div
          key={paper.id}
          className="absolute w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform"
          style={{
            left: `${paper.x}px`,
            top: `${paper.y}px`,
            transform: `rotate(${paper.rotation}deg)`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-purple-400/50"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
        </div>
      ))}
    </div>
  )
}

