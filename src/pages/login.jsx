import React, { useContext, useState } from "react";
import HomePage from "./home";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../userContex";

const LoginPage = () => {
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

export default LoginPage;

const Modal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logined, setLogined] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { User, SetUser } = useContext(UserContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setSubmitting(true);
      const user = await axios.post("/api/login", { email, password });
      SetUser(user.data);
      setLogined(true);
    } catch (error) {
      const serverMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid email or password.";
      setErrorMsg(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };
  if (logined) {
    return <Navigate to="/"></Navigate>;
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

          {errorMsg && (
            <div
              role="alert"
              className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-theme text-white py-1 rounded-lg hover:scale-[101%] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center p-2 text-gray-500">
          Don't have an account yet?{" "}
          <Link className="underline text-black" to={"/register"}>
            Register
          </Link>
        </div>

        {/* Social media sign-in options */}
        <div className="mt-6 flex flex-col justify-center space-y-4">
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex justify-between items-center hover:bg-gray-100 transition duration-300">
            <span className="text-center flex-1 text-gray-700">
              Continue with Google
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex justify-between items-center hover:bg-gray-100 transition duration-300">
            <span className="text-center flex-1 text-gray-700">
              Continue with Facebook
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#039be5"
                d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
              ></path>
              <path
                fill="#fff"
                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
              ></path>
            </svg>
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex justify-between items-center hover:bg-gray-100 transition duration-300">
            <span className="text-center flex-1 text-gray-700">
              Continue with Twitter
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M 17.214844 2.9863281 A 1.250125 1.250125 0 0 0 16.277344 3.4648438 L 12.351562 8.3339844 L 9.0566406 3.7714844 C 8.7066406 3.2874844 8.1458281 3 7.5488281 3 L 4.078125 3 C 3.420125 3 3.0388281 3.7462969 3.4238281 4.2792969 L 9.1855469 12.257812 L 3.7773438 18.964844 A 1.250125 1.250125 0 1 0 5.7226562 20.535156 L 10.703125 14.359375 L 14.943359 20.228516 C 15.293359 20.712516 15.854172 21 16.451172 21 L 19.921875 21 C 20.579875 21 20.961172 20.253703 20.576172 19.720703 L 13.869141 10.433594 L 18.222656 5.0351562 A 1.250125 1.250125 0 0 0 17.214844 2.9863281 z"></path>
            </svg>
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
