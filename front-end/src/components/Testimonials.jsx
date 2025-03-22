"use client"

import { useEffect, useRef } from "react"

export default function Testimonials() {
  const containerRef = useRef(null)

  // Create more testimonials for the grid layout
  const testimonials = [
    // Column 1
    {
      id: 1,
      name: "Amit Verma",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: 
        "I uploaded my resume and instantly received job recommendations that perfectly matched my skills. This platform saved me hours of searching.",
      stars: 5,
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Marketing Specialist",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      quote: 
        "The resume-based job suggestions were spot on! I found several marketing roles that aligned with my experience in no time.",
      stars: 4,
    },
    {
      id: 3,
      name: "Rahul Gupta",
      role: "Data Scientist",
      image: "https://randomuser.me/api/portraits/men/50.jpg",
      quote: 
        "I was impressed by how accurately the platform matched me with data science roles based on my resume's skills and certifications.",
      stars: 5,
    },
    // Column 2
    {
      id: 4,
      name: "Anjali Mehta",
      role: "UI/UX Designer",
      image: "https://randomuser.me/api/portraits/women/39.jpg",
      quote: 
        "Uploading my resume streamlined my job search. I received design job suggestions relevant to my portfolio and past projects.",
      stars: 5,
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Project Manager",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      quote: 
        "The resume-matching feature connected me with project management roles that perfectly aligned with my leadership experience.",
      stars: 4,
    },
    {
      id: 6,
      name: "Neha Reddy",
      role: "HR Executive",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      quote: 
        "I found HR roles tailored to my skills and past work experience. The job recommendations were highly relevant.",
      stars: 5,
    },
    // Column 3
    {
      id: 7,
      name: "Rajesh Kumar",
      role: "Full-Stack Developer",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      quote: 
        "The AI matched my resume with full-stack developer jobs that aligned with my React and Node.js skills.",
      stars: 5,
    },
    {
      id: 8,
      name: "Simran Kaur",
      role: "Content Writer",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
      quote: 
        "I was amazed by how quickly I received content writing job suggestions that fit my experience and preferences.",
      stars: 4,
    },
    {
      id: 9,
      name: "Arjun Malhotra",
      role: "DevOps Engineer",
      image: "https://randomuser.me/api/portraits/men/61.jpg",
      quote: 
        "The platform found DevOps roles matching my AWS and CI/CD skills, making my job search far more efficient.",
      stars: 5,
    },
    // Column 4
    {
      id: 10,
      name: "Kavita Nair",
      role: "Finance Analyst",
      image: "https://randomuser.me/api/portraits/women/52.jpg",
      quote: 
        "The resume-based job recommendations were highly accurate. I found finance roles perfectly suited to my experience.",
      stars: 4,
    },
    {
      id: 11,
      name: "Rohan Das",
      role: "Network Engineer",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      quote: 
        "The job-matching algorithm quickly connected me with network engineering positions relevant to my certifications.",
      stars: 5,
    },
    {
      id: 12,
      name: "Sneha Kapoor",
      role: "Digital Marketing Manager",
      image: "https://randomuser.me/api/portraits/women/36.jpg",
      quote: 
        "I found digital marketing jobs tailored to my SEO and social media expertise. The platform saved me a lot of time.",
      stars: 5,
    },
  ];
  

  // Group testimonials into columns of 3
  const columns = [
    testimonials.slice(0, 3),
    testimonials.slice(3, 6),
    testimonials.slice(6, 9),
    testimonials.slice(9, 12),
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add animation classes when the section is visible
          containerRef.current.classList.add("animate-fade-in")
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <section id="testimonials-section" className="lg:mt-20 relative z-10 overflow-hidden">
      <div className="mx-auto w-[80%]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Leading Researchers
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how researchers around the world are using our AI to transform their academic work into engaging
            content.
          </p>
        </div>

         <div
          ref={containerRef}
          className="relative mx-auto opacity-0 transition-opacity duration-1000 h-[600px] lg:mt-[20%]"
          style={{ opacity: 1 }} 
        >
          
          <div className="absolute top-0 left-0 right-0 h-20   to-transparent z-10 pointer-events-none"></div>

           <div className="flex gap-6 h-full">
            {columns.map((column, columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                className={`flex flex-col gap-6 ${columnIndex % 2 === 0 ? "animate-scroll-down" : "animate-scroll-up"}`}
              >
                 {[...column, ...column, ...column].map((testimonial, index) => (
                  <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            ))}
          </div>

           <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/[0.96] to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="flex-shrink-0 w-full h-64 rounded-xl p-6 flex flex-col justify-between transform transition-transform hover:scale-105 neumorphic-card">
      {/* Quote */}
      <p className="text-white text-sm mb-4 line-clamp-4">"{testimonial.quote}"</p>

      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={i < testimonial.stars ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-4 h-4 ${i < testimonial.stars ? "text-yellow-400" : "text-gray-600"}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-purple-500/30">
          <img
            src={testimonial?.image}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-white text-sm font-medium">{testimonial.name}</h4>
          <p className="text-purple-400 text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

