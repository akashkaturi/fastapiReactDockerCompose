import React, { useState } from 'react';
import ImageForm from './components/ImageForm';
import ImageList from './components/ImageList';

const App = () => {
    const [refreshList, setRefreshList] = useState(false);

    const handleImageUpload = () => {
        setRefreshList(!refreshList); // Toggle state to refresh image list
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center">Image Upload to S3</h1>
            <ImageForm onImageUpload={handleImageUpload} />
            <ImageList key={refreshList} /> {/* Change key to force re-render on upload */}
        </div>
    );
};

export default App;
