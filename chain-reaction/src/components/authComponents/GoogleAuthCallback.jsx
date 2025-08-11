import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedGridPattern from '../errorPages/AnimatedGridPattern';

function GoogleAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Get the token from the URL after successful Google login
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');  // token is in the URL as ?token=...

        if (token) {
            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Redirect to the home page or dashboard
            navigate('/'); // Redirect to the desired page after login
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0">
                <AnimatedGridPattern
                width={30}
                height={30}
                numSquares={150}
                maxOpacity={0.2}
                duration={4}
                repeatDelay={1}
                className="pointer-events-none"
                />
            </div>

            {/* Content Section */}
            <div className="relative z-10 text-center">
                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto"></div>

                {/* Text */}
                <h2 className="mt-6 text-3xl font-semibold text-gray-300 drop-shadow-sm">
                Processing...
                </h2>
                <p className="mt-2 text-gray-400 max-w-lg mx-auto leading-relaxed">
                Please wait while we get things ready for you.
                </p>
            </div>
        </div>
    );
}

export default GoogleAuthCallback;
