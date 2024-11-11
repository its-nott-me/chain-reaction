import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error message
    const [username, setUsername] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error

        try {
            let result = await axios.post('/register', { email, password, username });
            console.log(result.data.message);
            window.location.href = "/login"
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // If user already exists
                setError('User already registered. Please try logging in.');
            } else {
                console.error('Error registering:', error);
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        Register
                    </button>
                </form>
                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
}

export default Register;
