import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageItem from './ImageItem';

const ImageList = () => {
    const [images, setImages] = useState([]);

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:8001/images/');
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
            console.log(JSON.stringify(error))
            console.log("hello")

        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImageDelete = (filename) => {
        setImages(images.filter(image => image.filename !== filename));
    };

    // Function to refresh image list
    const refreshImageList = () => {
        fetchImages();
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Uploaded Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map(image => (
                    <ImageItem key={image.filename} image={image} onDelete={handleImageDelete} />
                ))}
            </div>
            <button 
                onClick={refreshImageList} 
                className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Refresh Image List
            </button>
        </div>
    );
};

export default ImageList;
