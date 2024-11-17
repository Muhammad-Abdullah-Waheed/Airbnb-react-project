import React, { useState } from 'react';
import HomePage from './home';
import { useNavigate , Link} from "react-router-dom";
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const goToHomePage = () => {
        navigate("/");
    };

    return (
        <div>
            <HomePage />
            <Modal isOpen={true} onClose={goToHomePage} />
        </div>
    );
};

export default RegisterPage;

const Modal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [usernumber, setUsernumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword0, setShowPassword0] = useState(false); // To toggle visibility of password
    const [showPassword1, setShowPassword1] = useState(false); // To toggle visibility of password

    // It will Register a new user in the database
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            console.log({ name, email, usernumber, password });
            try{
                axios.post('/api/register',{
                    name: name,
                    email: email,
                    password: password,
                    usernumber: usernumber,
                })
                alret("Rigisteration successful _!");
            }
            catch(error){
                console.log(error);
            }
            // Logic to handle registration
        } else {
            alert("Passwords do not match");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 animate-scaleUp">
                <h2 className="text-1xl font-semibold text-center mb-3">Register</h2>

                {/* Input fields */}
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Name"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={usernumber}
                            onChange={(e) => setUsernumber(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Phone number"
                        />
                    </div>

                    {/* Password field with toggle */}
                    <div className="mb-4 relative">
                        <input
                            type={showPassword0 ? "text" : "password"} // Toggle password visibility
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword0(!showPassword0)} // Toggle visibility
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword0 ? "Hide" : "Show"} {/* Toggle text */}
                        </button>
                    </div>

                    <div className="mb-4 relative">
                        <input
                            type={showPassword1 ? "text" : "password"} // Toggle password visibility
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Confirm Password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword1(!showPassword1)} // Toggle visibility
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword1 ? "Hide" : "Show"} {/* Toggle text */}
                        </button>
                    </div>

                    {/* Register button */}
                    <button
                        type="submit"
                        className="w-full bg-theme text-white py-1 rounded-lg hover:scale-[101%]"
                    >
                        Register
                    </button>
                </form>

                <div className='text-center p-2 text-gray-500'>
                    Already have an account? <Link className='underline text-black' to={'/login'}>Login</Link>
                </div>

                {/* Social media sign-in options */}
                <div className="mt-6 flex justify-center space-x-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        Continue with Google
                    </button>
                    <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
                        Continue with Facebook
                    </button>
                    <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
                        Continue with Twitter
                    </button>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};
