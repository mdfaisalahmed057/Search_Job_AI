"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10 transition-all duration-300 ${
        scrolled ? "bg-black/50" : "bg-transparent"
      }`}
      style={{
        transform: scrolled ? "translateY(0)" : "translateY(0)",
        opacity: 1,
      }}
    >
      <a href="/" className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-purple-500"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
        <span className="text-white font-medium text-xl">JobSearchAI</span>
      </a>

      <div className="hidden md:flex items-center space-x-8">
         <NavLink  >What's Up</NavLink>
  
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Link to='/upload'>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
          Get Started
        </button>
        </Link>
        {/* <button className="text-white hover:text-purple-400 px-4 py-2 rounded-md transition-colors">Sign In</button> */}
     
      </div>

      <button className="md:hidden text-white p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <a href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </a>
  )
}

