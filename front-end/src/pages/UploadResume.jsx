import React, { useState, useEffect } from 'react';
import { SparklesCore } from '../components/Sparkles';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Client, Databases,Storage, Role,ID } from "appwrite";
import { Permission } from 'appwrite';
import { Notification } from '../components/CustomUI';

 const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')  
  .setProject('67d49957000883a68009');  

  const storage = new Storage(client);

function UploadResume() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [appwriteFileId, setAppwriteFileId] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      setNotification({ message: 'Please upload a PDF file', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    
    try {
       const appwriteFile = await uploadToAppwrite(file);
      setAppwriteFileId(appwriteFile.$id);
      
       const fileUrl = getAppwriteFileUrl(appwriteFile.$id);
      console.log('File stored in Appwrite with ID:', appwriteFile.$id);
      console.log('File URL:', fileUrl);
      
       const formData = new FormData();
      formData.append('file', file); 
    
      
       const response = await fetch('https://backend-for-job-scrap.onrender.com/api/jobs/extract_resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Resume data:', data);
      
       navigate('/search-for-jobs', { 
        state: { 
          resumeData: data,
          fileId: appwriteFile.$id,
          fileUrl: fileUrl 
        } 
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification({ message: 'Failed to upload file. Please try again.', type: 'error' });
      
       if (appwriteFileId) {
        try {
          await storage.deleteFile('67d499a0001ceec255c8', appwriteFileId);
          console.log('Cleaned up Appwrite file after backend failure');
        } catch (cleanupError) {
          console.error('Error cleaning up Appwrite file:', cleanupError);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToAppwrite = async (file) => {
    try {
        const result = await storage.createFile(
            '67d499a0001ceec255c8',   
            ID.unique(),
            file,
            [
                Permission.read(Role.any()),  
                Permission.write(Role.any())  
              ],
            (progress) => {
                console.log(`Upload progress: ${progress.progress}%`);
            }
        );
        console.log("File uploaded:", result);
        return result;
    } catch (error) {
        console.error('Appwrite upload error:', error.message);
        throw new Error('Failed to upload to Appwrite storage');
    }
};
 

   const getAppwriteFileUrl = (fileId) => {
    return storage.getFileView('67d499a0001ceec255c8', fileId);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
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

      <div className="relative z-10 pt-20 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Upload Section - Top 20% of screen */}
          <div className="mb-16 flex flex-col items-center">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-6">
              Upload Your Resume
            </h2>
            
            <div 
              {...getRootProps()} 
              className={`w-full max-w-md p-6 border-2 border-dashed ${isDragActive ? 'border-pink-500 bg-black/60' : 'border-purple-500 bg-black/40'} rounded-lg backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center">
                {!isUploading ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-300 mb-4 text-center">
                      {isDragActive ? "Drop your PDF resume here" : "Drag and drop your PDF resume or click to browse"}
                    </p>
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md hover:from-purple-600 hover:to-pink-700 transition-all">
                      <span className="text-white font-medium">Select PDF</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white">Uploading {uploadedFile?.name}...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Existing section */}
          <h1 className="text-center text-xl md:text-2xl lg:text-4xl font-bold text-white mb-6">
            Transform Your Research with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {" "}
              AI Power
            </span>
          </h1>
        </div>
      </div>
    </main>
  );
}

export default UploadResume;