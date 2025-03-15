"use client"

import { useState, useEffect } from "react"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const testimonials = [
    {
      id: 1,
      name: "Salman Auto",
      role: "Software Engineer at TechCorp",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      quote:
        "Thanks to this platform, I landed my dream job as a Software Engineer! The AI-driven resume builder and job-matching system were game-changers for me.",
      stars: 5,
    },
    {
      id: 2,
      name: "Khaja Tent House",
      role: "Data Analyst at Insights Inc.",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
      quote:
        "I was struggling to find the right job, but this platform connected me with top companies in my field. The interview prep tools gave me the confidence I needed.",
      stars: 5,
    },
    {
      id: 3,
      name: "Ganesh Ape",
      role: "Marketing Specialist at BrandHive",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      quote:
        "The AI-powered job recommendations were spot on! Within weeks, I secured a fantastic role in marketing that perfectly matched my skills and interests.",
      stars: 4,
    },
  ];
  
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("testimonials-section")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section id="testimonials-section" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Many Software Developer
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
          See how developers around the world are using our AI to transform their job hunt into a hassle-free hustle.
                    </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transitionDelay: "0.2s",
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>

            {/* Quote marks */}
            <div className="absolute top-6 left-6 text-purple-500/20 text-7xl font-serif">"</div>

            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 ${activeIndex === index ? "block opacity-100" : "hidden opacity-0"}`}
              >
                <div className="text-center">
                  <p className="text-white text-lg md:text-xl italic mb-8 relative z-10">{testimonial.quote}</p>

                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={i < testimonial.stars ? "currentColor" : "none"}
                        stroke="currentColor"
                        className={`w-5 h-5 ${i < testimonial.stars ? "text-yellow-400" : "text-gray-600"}`}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                     ))}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mb-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-purple-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? "bg-purple-500 scale-110" : "bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

