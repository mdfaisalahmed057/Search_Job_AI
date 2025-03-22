"use client"

import { Link } from "react-router-dom"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-10">
   

        {/* Bottom footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} ResearchAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span   className="text-gray-400 hover:text-purple-400 text-sm">Terms of Service</span>
            <span   className="text-gray-400 hover:text-purple-400 text-sm">Privacy Policy</span>
            <span  className="text-gray-400 hover:text-purple-400 text-sm">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}