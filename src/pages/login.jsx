import React, { useState} from 'react';
import HomePage from './home';
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const goToHomePage = () => {
        navigate("/");
    };

    return (
        <div>
            <HomePage/>
            <Modal isOpen={true} onClose={goToHomePage} />
        </div>
    );
};

export default LoginPage;

const Modal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logined, setLogined] = useState(false);

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        
        try{
            const user = await axios.post('/api/login',{
                email:email,
                password:password,
            });
            console.log("Login successful _!");
            setLogined(true);
        }
        catch(error){
            alert('Uscessful login due to Invalid credentials!')
            console.log(error);
        }
    };
    if(logined) {
        return <Navigate to='/'></Navigate>
    } 

    if (!isOpen) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 animate-scaleUp">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                {/* Input fields */}
                <form onSubmit={handleFormSubmit}>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-dotted focus:ring-2 focus:ring-gray-600"
                            placeholder="Email address"
                        />
                    </div>


                    <div className="mb-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Password"
                        />
                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        className="w-full bg-theme text-white py-1 rounded-lg hover:scale-[101%]"
                    >
                        Login
                    </button>
                </form>


                <div className='text-center p-2 text-gray-500'>
                    Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register</Link>
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
