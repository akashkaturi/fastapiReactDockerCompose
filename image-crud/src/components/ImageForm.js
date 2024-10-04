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

        try {
            await axios.post('http://localhost:8001/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    // Calculate and update the progress percentage
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-2 border border-gray-300 rounded p-2 w-full" 
                required 
            />
            <button 
                type="submit" 
                disabled={uploading} 
                className={`w-full p-2 text-white rounded ${
                    uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {uploading && (
                <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded">
                        <div
                            className={`h-full bg-green-500 transition-all duration-300`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm mt-1 text-gray-700">{uploadStatus} - {progress}%</p>
                </div>
            )}
        </form>
    );
};

export default ImageForm;
