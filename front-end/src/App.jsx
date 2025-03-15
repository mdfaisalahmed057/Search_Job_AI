import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ResumeDetails from "./pages/ResumeDetails";
import UploadResume from "./pages/UploadResume";
import SearchForJobs from "./pages/SearchForJobs";
 function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/resume-details" element={<ResumeDetails />} />
        <Route path="/search-for-jobs" element={<SearchForJobs />} />

      </Routes>
    </Router>
  );
}

export default App;
