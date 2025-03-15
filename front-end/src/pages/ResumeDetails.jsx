import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SparklesCore } from '../components/Sparkles';

function ResumeDetails() {
  const location = useLocation();
  const resumeData = location.state?.resumeData || null;

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-black/[0.96] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">No resume data found</h2>
          <Link to="/upload" className="text-purple-400 hover:text-purple-300 underline">
            Go back to upload page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10 pt-10 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-block mb-6 text-purple-400 hover:text-purple-300">
            ← Back to Upload
          </Link>
          
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-8 border border-purple-900/50 shadow-lg">
            {/* Header Section */}
            <div className="mb-10 pb-6 border-b border-purple-900/30">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{resumeData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{resumeData.email}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{resumeData.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{resumeData.location}</span>
                </div>
                {resumeData.linkedin && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>{resumeData.linkedin}</span>
                  </div>
                )}
                {resumeData.portfolio && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Work Experience */}
            {resumeData.work_experience && resumeData.work_experience.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.work_experience.map((job, index) => (
                    <div key={index} className="bg-black/40 p-4 rounded-lg border border-purple-900/30">
                      <div className="flex flex-wrap justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                        <span className="text-purple-400 font-medium">{job.duration}</span>
                      </div>
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <p className="text-gray-300 font-medium">{job.company}</p>
                        <p className="text-gray-400">{job.location}</p>
                      </div>
                      <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="bg-black/40 p-4 rounded-lg border border-purple-900/30 h-full">
                      <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {project.technologies && project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-line">{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Skills */}
            {resumeData.skills && (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Skills
                </h2>
                <div className="bg-black/40 p-4 rounded-lg border border-purple-900/30">
                  {resumeData.skills.technical.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-3">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.technical.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {resumeData.skills.soft.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.soft.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
            
            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                    <div key={index} className="bg-black/40 p-4 rounded-lg border border-purple-900/30">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                            <span className="text-purple-400 font-medium">{edu.duration}</span>
                        </div>
                        <div className="flex flex-wrap justify-between items-start">
                            <p className="text-gray-300">{edu.institution}</p>
                            <p className="text-gray-400">{edu.location}</p>
                        </div>
                        {edu.grade && (
                            <p className="text-purple-300 mt-2">Grade: {edu.grade}</p>
                        )}
                    </div>
                ))}
                          </section>
                      )}

          {/* Languages */}
          {resumeData.languages_known && resumeData.languages_known.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Languages
              </h2>
              <div className="bg-black/40 p-4 rounded-lg border border-purple-900/30">
                <div className="flex flex-wrap gap-3">
                  {resumeData.languages_known.map((language, index) => (
                    <span key={index} className="px-4 py-2 bg-purple-900/30 text-purple-300 rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Certifications
              </h2>
              <div className="space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="bg-black/40 p-4 rounded-lg border border-purple-900/30">
                    <h3 className="text-lg font-bold text-white mb-1">{cert.name}</h3>
                    {cert.issuer && <p className="text-gray-300">Issuer: {cert.issuer}</p>}
                    {cert.date && <p className="text-purple-400 mt-1">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          <div className="flex justify-center mt-12">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
            >
              Upload Another Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}

export default ResumeDetails;