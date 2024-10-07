import React from 'react';
import axios from 'axios';

const ImageItem = ({ image, onDelete }) => {
    const apiUrl = process.env.REACT_APP_CUSTOM_DOMAIN;

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${apiUrl}:8001/images/${image.filename}`);
            onDelete(image.filename);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img src={image.url} alt={image.filename} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-semibold text-xl">{image.filename}</h3>
                <button 
                    onClick={handleDelete} 
                    className="mt-2 w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ImageItem;
