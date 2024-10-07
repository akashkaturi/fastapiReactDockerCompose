import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageItem from './ImageItem';

const ImageList = () => {
    const [images, setImages] = useState([]);
    const apiUrl = process.env.REACT_APP_CUSTOM_DOMAIN;

    const fetchImages = async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:8001/images/`);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImageDelete = (filename) => {
        setImages(images.filter(image => image.filename !== filename));
    };

    const refreshImageList = () => {
        fetchImages();
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Uploaded Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map(image => (
                    <ImageItem key={image.filename} image={image} onDelete={handleImageDelete} />
                ))}
            </div>
            <button 
                onClick={refreshImageList} 
                className="mt-6 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
            >
                Refresh Image List
            </button>
        </div>
    );
};

export default ImageList;
