import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext'; // Import your ThemeContext
import ImageForm from './components/ImageForm';
import ImageList from './components/ImageList';

const AppContent = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    
    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
            <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <h1 className="text-2xl font-bold">Image Upload</h1>
                <button
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded bg-white text-blue-500 hover:bg-gray-200 transition duration-300"
                >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold text-center mb-4">Image Upload to S3</h2>
                <ImageForm />
                <ImageList />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
