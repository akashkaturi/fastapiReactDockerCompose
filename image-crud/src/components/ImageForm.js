import React, { useState } from 'react';
import axios from 'axios';

const ImageForm = ({ onImageUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', file);
        const apiUrl = process.env.REACT_APP_CUSTOM_DOMAIN;

        try {
            await axios.post(`http://${apiUrl}:8001/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            setUploadStatus('Upload successful!');
            setFile(null);
            onImageUpload(); // Refresh the image list after upload
        } catch (error) {
            setUploadStatus('Error uploading the image.');
            console.error("Error uploading the image:", error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg mt-6 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Image</h2>
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-4 border border-gray-300 rounded-lg p-2 w-full bg-white text-gray-700" 
                required 
            />
            <button 
                type="submit" 
                disabled={uploading} 
                className={`w-full p-2 rounded-lg transition duration-300 ${
                    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l'
                }`}
            >
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {uploading && (
                <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm mt-1 text-center">{uploadStatus} - {progress}%</p>
                </div>
            )}
        </form>
    );
};

export default ImageForm;
