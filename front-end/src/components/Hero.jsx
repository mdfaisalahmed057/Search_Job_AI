"use client"

import { useEffect, useState, useRef } from "react"
import { FloatingPaper } from "./FloatingPaper"
import { RoboAnimation } from "./RoboAnimation"
import { Link } from "react-router-dom"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)

    // Set up autoplay when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error)
        
        // Add event listener for user interaction to play video
        const playVideoOnInteraction = () => {
          videoRef.current.play();
          document.removeEventListener('click', playVideoOnInteraction);
        };
        document.addEventListener('click', playVideoOnInteraction);
      })
    }
  }, [])

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Transform Your Research with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                AI Power
              </span>
            </h1>
          </div>

          <p
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.2s",
            }}
          >
            Upload your resume, and let our AI match you with the best job opportunities based on your skills and
            experience. Get personalized job recommendations instantly! 🚀
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-500 mb-16"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.4s",
            }}
          >
            <Link to="/upload">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-5 w-5"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
                Upload Your Resume
              </button>
            </Link>
          </div>

          {/* How it works section with animated title */}
          <div
            className="w-full transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.6s",
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-10 animate-pulse-gradient">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                How It Works
              </span>
            </h2>

            {/* Video container */}
            <div className="mx-auto" style={{ width: "100%", height: "100%" }}>
              <div className="relative rounded-lg overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  onLoadedData={handleVideoLoaded}
                >
                  <source src="/src/assets/showcase.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Fallback image in case video doesn't load - only show if video isn't loaded */}
                {!videoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-16 h-16 mx-auto mb-4 text-purple-500"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                        <p className="text-xl font-medium">Video Demonstration</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}