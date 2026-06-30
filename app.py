from flask import Flask, request, jsonify
import fitz  # PyMuPDF for PDF parsing
import docx
import os
import google.generativeai as genai
import json
import requests
from bs4 import BeautifulSoup
import json
import re
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse, urljoin
import time
import random
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure Gemini API using environment variable
gemini_api_key = os.environ.get("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment.")

CORS(app)  # Enables CORS for all routes




# User agent rotation to avoid being blocked
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0'
]

# Default job portals to scrape if no custom URL is provided
DEFAULT_JOB_PORTALS = {
    'indeed': 'https://www.indeed.com/jobs?q={role}+{skills}&l={location}',
    'linkedin': 'https://www.linkedin.com/jobs/search/?keywords={role}%20{skills}&location={location}',
    'glassdoor': 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword={role}%20{skills}&locT=C&locId={location}'
}

# Rate limiting settings
MIN_REQUEST_INTERVAL = 1  # Minimum seconds between requests to same domain
MAX_CONCURRENT_REQUESTS = 5  # Maximum number of concurrent requests

# Memory monitoring
def get_memory_usage():
    """Get current memory usage in MB"""
    import psutil
    process = psutil.Process()
    return process.memory_info().rss / (1024 * 1024)  # Convert to MB

class JobScraper:
    def __init__(self):
        self.session = requests.Session()
        self.last_request_time = {}  # Track last request time per domain
        
    def get_random_user_agent(self):
        """Return a random user agent from the list."""
        return random.choice(USER_AGENTS)
    
    def respect_rate_limits(self, domain):
        """Ensure we don't hammer a domain with requests."""
        current_time = time.time()
        if domain in self.last_request_time:
            elapsed = current_time - self.last_request_time[domain]
            if elapsed < MIN_REQUEST_INTERVAL:
                time.sleep(MIN_REQUEST_INTERVAL - elapsed)
        self.last_request_time[domain] = time.time()
    
    def fetch_page(self, url):
        """Fetch a page with proper headers and rate limiting."""
        domain = urlparse(url).netloc
        self.respect_rate_limits(domain)
        headers = {
            'User-Agent': self.get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        }
        try:
            response = self.session.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def parse_indeed_job(self, job_element):
        """Parse job data from Indeed."""
        try:
            job_data = {}
            title_elem = job_element.select_one('h2.jobTitle')
            job_data['job_title'] = title_elem.get_text().strip() if title_elem else "N/A"
            
            company_elem = job_element.select_one('span.companyName')
            job_data['company'] = company_elem.get_text().strip() if company_elem else "N/A"
            
            location_elem = job_element.select_one('div.companyLocation')
            job_data['location'] = location_elem.get_text().strip() if location_elem else "N/A"
            
            job_link = job_element.select_one('a.jcs-JobTitle')
            if job_link and job_link.get('href'):
                job_data['application_link'] = urljoin('https://www.indeed.com', job_link.get('href'))
            else:
                job_data['application_link'] = "N/A"
            
            date_elem = job_element.select_one('span.date')
            job_data['posting_date'] = date_elem.get_text().strip() if date_elem else "N/A"
            
            job_data['job_type'] = self.extract_job_type(job_element)
            job_data['required_skills'] = []  # Placeholder – would require extra parsing
            job_data['job_description'] = "Visit job page for full description"
            job_data['salary_range'] = self.extract_salary(job_element)
            job_data['cover_letter'] = self.generate_cover_letter(job_data)
            job_data['status'] = "Pending"
            
            return job_data
        except Exception as e:
            print(f"Error parsing Indeed job: {e}")
            return None
    
    def parse_linkedin_job(self, job_element):
        """Parse job data from LinkedIn."""
        try:
            job_data = {}
            title_elem = job_element.select_one('h3.base-search-card__title')
            job_data['job_title'] = title_elem.get_text().strip() if title_elem else "N/A"
            
            company_elem = job_element.select_one('h4.base-search-card__subtitle')
            job_data['company'] = company_elem.get_text().strip() if company_elem else "N/A"
            
            location_elem = job_element.select_one('span.job-search-card__location')
            job_data['location'] = location_elem.get_text().strip() if location_elem else "N/A"
            
            job_link = job_element.select_one('a.base-card__full-link')
            job_data['application_link'] = job_link.get('href') if job_link else "N/A"
            
            date_elem = job_element.select_one('time.job-search-card__listdate')
            job_data['posting_date'] = date_elem.get('datetime') if date_elem and date_elem.get('datetime') else "N/A"
            
            job_data['job_type'] = "N/A"  # Placeholder – additional details may be needed
            job_data['required_skills'] = []  # Placeholder
            job_data['job_description'] = "Visit job page for full description"
            job_data['salary_range'] = "N/A"  # Placeholder
            job_data['cover_letter'] = self.generate_cover_letter(job_data)
            job_data['status'] = "Pending"
            
            return job_data
        except Exception as e:
            print(f"Error parsing LinkedIn job: {e}")
            return None
    
    def parse_glassdoor_job(self, job_element):
        """Parse job data from Glassdoor."""
        try:
            job_data = {}
            title_elem = job_element.select_one('a.jobLink')
            job_data['job_title'] = title_elem.get_text().strip() if title_elem else "N/A"
            
            company_elem = job_element.select_one('div.empleyer-name')
            job_data['company'] = company_elem.get_text().strip() if company_elem else "N/A"
            
            location_elem = job_element.select_one('span.location')
            job_data['location'] = location_elem.get_text().strip() if location_elem else "N/A"
            
            job_link = job_element.select_one('a.jobLink')
            job_data['application_link'] = urljoin('https://www.glassdoor.com', job_link.get('href')) if job_link else "N/A"
            
            job_data['job_type'] = "N/A"
            job_data['required_skills'] = []  # Placeholder
            job_data['job_description'] = "Visit job page for full description"
            job_data['salary_range'] = "N/A"
            job_data['posting_date'] = "N/A"
            job_data['cover_letter'] = self.generate_cover_letter(job_data)
            job_data['status'] = "Pending"
            
            return job_data
        except Exception as e:
            print(f"Error parsing Glassdoor job: {e}")
            return None
    
    def parse_generic_job(self, job_element, selectors):
        """Parse job data using custom selectors for generic job sites."""
        try:
            job_data = {}
            for field, selector in selectors.items():
                elem = job_element.select_one(selector)
                job_data[field] = elem.get_text().strip() if elem else "N/A"
            if 'required_skills' not in job_data:
                job_data['required_skills'] = []
            if 'cover_letter' not in job_data:
                job_data['cover_letter'] = self.generate_cover_letter(job_data)
            if 'status' not in job_data:
                job_data['status'] = "Pending"
            return job_data
        except Exception as e:
            print(f"Error parsing generic job: {e}")
            return None
    
    def extract_job_type(self, job_element):
        """Extract job type from job element text."""
        job_type_patterns = ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'remote']
        job_text = job_element.get_text().lower()
        for pattern in job_type_patterns:
            if pattern in job_text:
                return pattern.title()
        return "N/A"
    
    def extract_salary(self, job_element):
        """Extract salary information from job element."""
        salary_elem = job_element.select_one('div.salary-snippet')
        if salary_elem:
            return salary_elem.get_text().strip()
        job_text = job_element.get_text()
        salary_pattern = r'\$\d+(?:,\d+)?(?:\s*-\s*\$\d+(?:,\d+)?)?(?:\s*(?:per|a|\/)\s*(?:year|month|hour|yr|hr|week|wk))?'
        salary_match = re.search(salary_pattern, job_text)
        if salary_match:
            return salary_match.group(0)
        return "N/A"
    
    def generate_cover_letter(self, job_data):
        """Generate a generic cover letter template based on job data."""
        company = job_data.get('company', 'the company')
        title = job_data.get('job_title', 'the position')
        skills = ", ".join(job_data.get('required_skills', [])) if job_data.get('required_skills') else "my relevant skills"
        cover_letter = f"""Dear Hiring Manager,

I am excited to apply for the {title} role at {company}. With my experience in {skills}, I am confident in my ability to contribute effectively to your team.

I look forward to discussing how my skills align with your needs for the {title} position.

Best regards,
[Your Name]"""
        return cover_letter
    
    def extract_skills_from_description(self, description):
        """Extract potential skills from job description."""
        common_skills = [
            "Python", "JavaScript", "React", "Angular", "Vue", "Node.js",
            "Java", "C#", ".NET", "AWS", "Azure", "Google Cloud",
            "Docker", "Kubernetes", "SQL", "NoSQL", "MongoDB",
            "REST API", "GraphQL", "Machine Learning", "AI"
        ]
        found_skills = [skill for skill in common_skills if skill.lower() in description.lower()]
        return found_skills if found_skills else []
    
    def scrape_jobs(self, role, skills, location, num_jobs=10, custom_urls=None):
        """Scrape jobs from multiple sources based on role, skills, and location."""
        all_jobs = []
        urls_to_scrape = []
        
        # Prepare skills list and patterns for filtering
        skills_list = skills if isinstance(skills, list) else [s.strip() for s in skills.split(',')]
        skills_str = '+'.join(skills_list)
        skills_pattern = re.compile('|'.join([re.escape(skill) for skill in skills_list if skill]), re.IGNORECASE)
        location_pattern = re.compile(re.escape(location), re.IGNORECASE)
        
        # Prepare default URLs for known portals
        for portal, url_template in DEFAULT_JOB_PORTALS.items():
            url = url_template.format(
                role=role.replace(' ', '+'),
                skills=skills_str,
                location=location.replace(' ', '+')
            )
            urls_to_scrape.append((portal, url))
        
        # Add custom URLs if provided
        if custom_urls:
            if isinstance(custom_urls, str):
                custom_urls = [custom_urls]
            for url in custom_urls:
                urls_to_scrape.append(('custom', url))
        
        # Use a thread pool to scrape concurrently
        with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_REQUESTS) as executor:
            futures = []
            for portal, url in urls_to_scrape:
                futures.append(executor.submit(self.scrape_single_source, portal, url, num_jobs, skills_pattern, location_pattern))
            
            for future in futures:
                result = future.result()
                if result:
                    all_jobs.extend(result)
                
                if len(all_jobs) >= num_jobs:
                    all_jobs = all_jobs[:num_jobs]
                    break
                
                current_memory = get_memory_usage()
                print(f"Current memory usage: {current_memory:.2f} MB")
                if current_memory > 14000:  # Limit memory usage to 14GB
                    print("Memory usage too high, stopping job collection")
                    break
        
        return all_jobs
    
    def scrape_single_source(self, portal, url, max_jobs, skills_pattern, location_pattern):
        """Scrape a single job portal."""
        print(f"Scraping {portal}: {url}")
        html = self.fetch_page(url)
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        jobs_found = []
        
        try:
            jobs_by_portal = {
                'indeed': self._get_indeed_jobs(soup),
                'linkedin': self._get_linkedin_jobs(soup),
                'glassdoor': self._get_glassdoor_jobs(soup)
            }
            if portal in jobs_by_portal:
                raw_jobs = jobs_by_portal[portal]
            else:
                raw_jobs = self._get_generic_jobs(soup, url)
            
            # Filter jobs based on skills and location
            for job in raw_jobs:
                searchable_text = (
                    job.get('job_title', '') + ' ' +
                    job.get('job_description', '') + ' ' +
                    ','.join(job.get('required_skills', []))
                ).lower()
                job_location = job.get('location', '').lower()
                if (skills_pattern.search(searchable_text) and 
                    (location_pattern.search(job_location) or job_location == "unknown")):
                    jobs_found.append(job)
                    if len(jobs_found) >= max_jobs:
                        break
        except Exception as e:
            print(f"Error scraping {portal}: {e}")
        
        jobs_found.sort(key=lambda x: x.get('job_title', ''))
        print(f"Found {len(jobs_found)} relevant jobs from {portal}")
        return jobs_found[:max_jobs]
    
    # Helper methods for portal-specific scraping
    def _get_indeed_jobs(self, soup):
        job_elements = soup.select('div.jobsearch-SerpJobCard')
        jobs = []
        for elem in job_elements:
            job = self.parse_indeed_job(elem)
            if job:
                jobs.append(job)
        return jobs
    
    def _get_linkedin_jobs(self, soup):
        job_elements = soup.select('div.base-search-card')
        jobs = []
        for elem in job_elements:
            job = self.parse_linkedin_job(elem)
            if job:
                jobs.append(job)
        return jobs
    
    def _get_glassdoor_jobs(self, soup):
        job_elements = soup.select('li.jl')  # Example selector; adjust as needed
        jobs = []
        for elem in job_elements:
            job = self.parse_glassdoor_job(elem)
            if job:
                jobs.append(job)
        return jobs
    
    def _get_generic_jobs(self, soup, url):
        job_elements = soup.find_all('div', class_='job')  # Fallback generic selector
        jobs = []
        for elem in job_elements:
            job = self.parse_generic_job(elem, {
                'job_title': 'h2',
                'company': 'span.company',
                'location': 'div.location',
                'posting_date': 'span.date'
            })
            if job:
                jobs.append(job)
        return jobs

# Flask API endpoint

@app.route('/api/jobs', methods=['POST'])
def get_jobs():
    """API endpoint to get jobs based on criteria from POST payload."""
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({
                'error': 'Missing JSON payload',
                'required_fields': ['role', 'location'],
                'optional_fields': ['skills', 'num_jobs', 'urls']
            }), 400
        
        role = payload.get('role')
        location = payload.get('location')
        skills = payload.get('skills', [])
        num_jobs = payload.get('num_jobs', 10)
        custom_urls = payload.get('urls')
        
        if not role or not location:
            return jsonify({
                'error': 'Missing required fields in payload',
                'required': ['role', 'location'],
                'optional': ['skills', 'num_jobs', 'urls']
            }), 400
        
        scraper = JobScraper()
        jobs = scraper.scrape_jobs(role, skills, location, num_jobs, custom_urls)
        
        return jsonify({
            'status': 'success',
            'count': len(jobs),
            'jobs': jobs
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    memory_usage = get_memory_usage()
    return jsonify({
        'status': 'online',
        'memory_usage_mb': memory_usage,
        'timestamp': time.time()
    })

 
 

def extract_text_from_pdf(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text("text")
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_resume_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        return None

import json

def call_gemini(prompt):
    """Call Gemini using the google-generativeai SDK."""
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    if not response.text:
        raise ValueError("Gemini returned empty response")
    return response.text

def call_groq(prompt, api_key):
    """Call Groq API via direct HTTP request."""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    res_json = response.json()
    if 'choices' in res_json and len(res_json['choices']) > 0:
        return res_json['choices'][0]['message']['content']
    raise ValueError(f"Unexpected Groq API response structure: {res_json}")

def call_openrouter(prompt, api_key):
    """Call OpenRouter API via direct HTTP request."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:10000",
        "X-Title": "Search Jobs AI Backend"
    }
    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    res_json = response.json()
    if 'choices' in res_json and len(res_json['choices']) > 0:
        return res_json['choices'][0]['message']['content']
    raise ValueError(f"Unexpected OpenRouter API response structure: {res_json}")

def get_structured_resume_data(text):
    prompt = f"""
    Extract and format the following resume details from the text in **strict JSON format**:
    Name, Email, Phone, Location, LinkedIn, Portfolio, Skills (Technical & Soft),
    Education, Work Experience, Certifications, Projects, Languages Known.
    
    **Important:**
    - Output must be valid JSON.
    - Do **not** include any explanations or extra text.
    - Do **not** wrap JSON inside a code block.
    - Ensure proper nesting and data formatting.

    **Resume Text:**
    {text}

    **Expected Output Format:**
    {{
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "New York, USA",
      "linkedin": "john-doe",
      "portfolio": "https://johndoe.dev/",
      "skills": {{
        "technical": ["JavaScript", "React.js", "Node.js"],
        "soft": ["Communication", "Problem-solving"]
      }},
      "education": [
        {{
          "institution": "XYZ University",
          "location": "New York, USA",
          "degree": "B.Sc in Computer Science",
          "duration": "2018 - 2022",
          "grade": "3.8/4.0"
        }}
      ],
      "work_experience": [
        {{
          "title": "Software Engineer",
          "company": "TechCorp",
          "location": "San Francisco, USA",
          "duration": "Jan 2022 – Present",
          "description": "Developed full-stack applications with React and Node.js."
        }}
      ],
      "certifications": ["AWS Certified Developer"],
      "projects": [
        {{
          "name": "E-Commerce Platform",
          "technologies": ["React", "Node.js", "MongoDB"],
          "description": "Built a fully functional e-commerce website with authentication and payment integration."
        }}
      ],
      "languages_known": ["English", "Spanish"]
    }}
    """

    raw_text = None
    errors = []

    # 1. Try Gemini
    try:
        print("Attempting resume extraction with Gemini...")
        raw_text = call_gemini(prompt)
    except Exception as e:
        err_msg = f"Gemini failed: {str(e)}"
        print(err_msg)
        errors.append(err_msg)

    # 2. Try Groq (if Gemini failed)
    if not raw_text:
        groq_api_key = os.environ.get("GROQ_API_KEY")
        if groq_api_key:
            try:
                print("Attempting resume extraction with Groq...")
                raw_text = call_groq(prompt, groq_api_key)
            except Exception as e:
                err_msg = f"Groq failed: {str(e)}"
                print(err_msg)
                errors.append(err_msg)
        else:
            print("Groq API key not found in environment, skipping Groq fallback.")
            errors.append("Groq API key not found in environment.")

    # 3. Try OpenRouter (if both Gemini and Groq failed)
    if not raw_text:
        openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
        if openrouter_api_key:
            try:
                print("Attempting resume extraction with OpenRouter...")
                raw_text = call_openrouter(prompt, openrouter_api_key)
            except Exception as e:
                err_msg = f"OpenRouter failed: {str(e)}"
                print(err_msg)
                errors.append(err_msg)
        else:
            print("OpenRouter API key not found in environment, skipping OpenRouter fallback.")
            errors.append("OpenRouter API key not found in environment.")

    # If all options failed
    if not raw_text:
        return {
            "error": "All AI extraction attempts failed.",
            "details": errors
        }

    raw_text = raw_text.strip()
    
    # Try to find JSON in the response by looking for balanced braces
    start_idx = raw_text.find('{')
    if start_idx == -1:
        return {
            "error": "Could not find JSON structure in the response",
            "raw_response": raw_text[:200] + "..." if len(raw_text) > 200 else raw_text
        }
    
    # Track opening and closing braces to find the complete JSON object
    open_braces = 0
    json_str = None
    for i in range(start_idx, len(raw_text)):
        if raw_text[i] == '{':
            open_braces += 1
        elif raw_text[i] == '}':
            open_braces -= 1
            if open_braces == 0:
                # We found the matching closing brace for the first opening brace
                json_str = raw_text[start_idx:i+1]
                break
    
    if not json_str:
        return {
            "error": "Unbalanced JSON structure in response",
            "raw_response": raw_text[:200] + "..." if len(raw_text) > 200 else raw_text
        }
    
    # Try parsing the extracted JSON
    try:
        structured_data = json.loads(json_str)
        return structured_data
    except json.JSONDecodeError as e:
        # If parsing fails, return a detailed error message
        return {
            "error": f"JSON parsing failed: {str(e)}",
            "raw_response": raw_text[:100] + "..." if len(raw_text) > 100 else raw_text
        }


@app.route("/extract_resume", methods=["POST"])
def extract_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    
    # Ensure uploads directory exists
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_path = os.path.join(upload_dir, file.filename)
    file.save(file_path)
    
    try:
        text = extract_resume_text(file_path)
        if text is None:
            return jsonify({"error": "Unsupported file format"}), 400
        
        structured_data = get_structured_resume_data(text)
        
        # If there is an error in structured_data (i.e. all fallbacks failed)
        if isinstance(structured_data, dict) and "error" in structured_data:
            return jsonify(structured_data), 500
            
        return jsonify(structured_data)
    finally:
        # Always clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Get port from environment, default to 10000
    app.run(host="0.0.0.0", port=port) 