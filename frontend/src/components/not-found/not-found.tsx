import React from 'react';

function NotFound() {
    return (
        <div className="text-center" style={{ marginTop: '20vh', marginBottom: '20vh' }}>
            <p className="font-semibold text-6xl md:text-7xl mb-8 md:mb-11">Oops</p>
            <p className="font-medium text-gray-300 text-3xl md:text-4xl mb-4 md:mb-5">Something Went Wrong</p>
            <p className="font-normal text-gray-300 text-xl md:text-2xl">Error 404 Page Not Found</p>
        </div>
    );
}

export default NotFound;
