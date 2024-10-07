import React from 'react';
import axios from 'axios';

const ImageItem = ({ image, onDelete }) => {
    const apiUrl = process.env.CUSTOM_DOMAIN;


    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/images/${image.filename}`);
            onDelete(image.filename);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="bg-white rounded shadow-md overflow-hidden">
            <img src={image.url} alt={image.filename} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-semibold">{image.filename}</h3>
                <button 
                    onClick={handleDelete} 
                    className="mt-2 w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ImageItem;
