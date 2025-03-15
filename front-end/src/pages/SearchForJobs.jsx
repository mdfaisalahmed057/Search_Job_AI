import React, { useState, useEffect } from 'react';
import { SparklesCore } from '../components/Sparkles';
import { useLocation, useNavigate } from 'react-router-dom';

function SearchForJobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeData = location.state?.resumeData;
  
  const [isSearching, setIsSearching] = useState(false);
  const [jobResults, setJobResults] = useState(null);
  const [searchParams, setSearchParams] = useState({
    role: "",
    location: resumeData?.location?.split(',')[0] || "",
    skills: resumeData?.skills?.technical?.slice(0, 3) || [],
    num_jobs: 10
  });

  // Redirect if no resume data
  useEffect(() => {
    if (!resumeData) {
      navigate('/');
    } else {
      // Pre-fill form with resume data
      setSearchParams({
        role: resumeData.work_experience?.[0]?.title || "",
        location: resumeData.location?.split(',')[0] || "",
        skills: resumeData.skills?.technical?.slice(0, 3) || [],
        num_jobs: 10
      });
    }
  }, [resumeData, navigate]);

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...searchParams.skills];
    updatedSkills[index] = value;
    setSearchParams({ ...searchParams, skills: updatedSkills });
  };

  const addSkill = () => {
    if (searchParams.skills.length < 5) {
      setSearchParams({ ...searchParams, skills: [...searchParams.skills, ""] });
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = searchParams.skills.filter((_, i) => i !== index);
    setSearchParams({ ...searchParams, skills: updatedSkills });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const searchJobs = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setJobResults(null); // Clear previous results when starting a new search
    
    try {
      // Filter out empty skills
      const filteredSkills = searchParams.skills.filter(skill => skill.trim() !== "");
      
      const payload = {
        role: searchParams.role,
        location: searchParams.location,
        skills: filteredSkills,
        num_jobs: parseInt(searchParams.num_jobs)
      };
      
      const response = await fetch('http://127.0.0.1:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobResults(data);
      
      // Scroll to results after they load
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error searching for jobs:', error);
      alert('Failed to search for jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text, jobId) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        document.getElementById(`copy-btn-${jobId}`).classList.add('text-green-300');
        setTimeout(() => {
          document.getElementById(`copy-btn-${jobId}`).classList.remove('text-green-300');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Background sparkles effect */}
  
      <div className="relative z-10 pt-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-6">
            Find Your Perfect Job
          </h2>
  
          {/* Search Form */}
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 mb-8 border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <form onSubmit={searchJobs}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-white text-sm font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={searchParams.role}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-purple-500/50 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Frontend Developer"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-white text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-purple-500/50 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="City or Country"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-white text-sm font-medium mb-2">Skills (Up to 5)</label>
                {searchParams.skills.map((skill, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="flex-grow bg-black/60 border border-purple-500/50 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="JavaScript, React, etc."
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 bg-red-600/70 hover:bg-red-700 text-white rounded-md px-3 py-2 transition-colors"
                    >
                      <span>×</span>
                    </button>
                  </div>
                ))}
                
                {searchParams.skills.length < 5 && (
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-1 text-sm text-purple-400 hover:text-purple-300 flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Skill
                  </button>
                )}
              </div>
              
              <div className="mt-6">
                <label htmlFor="num_jobs" className="block text-white text-sm font-medium mb-2">Number of Jobs to Search</label>
                <select
                  id="num_jobs"
                  name="num_jobs"
                  value={searchParams.num_jobs}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-purple-500/50 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md text-white font-medium shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all ${isSearching ? 'opacity-70 cursor-not-allowed' : ''} transform hover:scale-105 active:scale-95`}
                >
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    'Search Jobs'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Full-screen loader */}
          {isSearching && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg font-medium">Searching for the perfect jobs...</p>
                <p className="text-purple-300 text-sm">This might take a moment</p>
              </div>
            </div>
          )}
          
          {/* Results Section */}
          {jobResults && (
            <div id="results-section" className="mb-10 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-bold">
                  Found {jobResults.count} job{jobResults.count !== 1 ? 's' : ''}
                </h3>
                
                <div className="px-3 py-1 bg-purple-500/20 rounded-full">
                  <span className="text-purple-200 text-sm">
                    Showing {jobResults.jobs.length} of {jobResults.count}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobResults.jobs.map((job, index) => (
                  <div 
                    key={index} 
                    className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-1 group"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">{job.job_title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${job.status === "Pending" ? "bg-yellow-500/30 text-yellow-200" : "bg-green-500/30 text-green-200"}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-purple-300 text-sm font-medium">{job.company}</p>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{job.job_type !== "N/A" ? job.job_type : "Not specified"}</span>
                        </div>
                        {job.salary_range !== "N/A" && (
                          <div className="flex items-center text-gray-400 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Posted: {new Date(job.posting_date).toLocaleDateString()}</span>
                        </div>
                      </div>
  
                      {job.required_skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-white mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.map((skill, i) => (
                              <span key={i} className="bg-purple-500/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
  
                      <div className="mb-4">
                        <p className="text-sm text-white mb-2">Cover Letter:</p>
                        <div className="bg-black/30 p-3 rounded-md flex justify-between items-center">
                          <p className="text-gray-300 text-sm">
                            {job.cover_letter.split(' ').slice(0, 8).join(' ')}...
                          </p>
                          <button 
                            id={`copy-btn-${index}`}
                            onClick={() => copyToClipboard(job.cover_letter, index)}
                            className="ml-2 text-purple-400 hover:text-purple-300 transition-colors focus:outline-none group"
                            title="Copy cover letter"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden group-hover:block absolute -mt-8 -ml-6 bg-black/80 text-xs text-white px-2 py-1 rounded">Copy</span>
                          </button>
                        </div>
                      </div>
  
                      <div className="mt-4 flex justify-between items-center">
                        <a 
                          href={job.application_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md text-white text-sm hover:from-purple-600 hover:to-pink-700 transition-all inline-flex items-center transform hover:scale-105"
                        >
                          Apply Now
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
  
                        <span className="text-xs text-gray-400">
                          Match: {Math.floor(70 + Math.random() * 30)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* No results message */}
              {jobResults && jobResults.jobs.length === 0 && (
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xl font-bold text-white mb-2">No jobs found</h4>
                  <p className="text-gray-400">Try adjusting your search parameters or skills to find more opportunities.</p>
                </div>
              )}
  
              {/* Load more button */}
              {jobResults && jobResults.jobs.length > 0 && jobResults.jobs.length < jobResults.count && (
                <div className="mt-8 flex justify-center">
                  <button className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-md text-purple-300 hover:bg-purple-500/30 transition-all transform hover:scale-105">
                    Load More Jobs
                  </button>
                </div>
              )}
  
            </div>
          )}
        </div> {/* Closes .w-full max-w-5xl */}
      </div> {/* Closes the outer container */}
    </main>
  );
}

export default SearchForJobs;
