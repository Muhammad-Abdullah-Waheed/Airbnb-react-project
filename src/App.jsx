import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/rigister.jsx";
import Layout from "./layout.jsx";
import axios from "axios";
import ListingDetailsPage from "./pages/ListingDetailsPage.jsx";
import { UserContextProvider } from "./userContex.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import RegisterListing from "./components/Listings/RigisterListing";

// Resolve the API base URL at build time:
//   - In local dev, VITE_API_URL=http://localhost:4000 (see .env.example).
//   - In production, either set VITE_API_URL to the deployed backend URL, or
//     leave it empty if the backend serves this frontend on the same origin
//     (monolithic deploy), in which case all /api/* calls are same-origin.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}></Route>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/Account" element={<AccountPage choice={1} />} />
            <Route path="/Account/bookings" element={<AccountPage choice={2}/>} />
            <Route path="/Account/listings" element={<AccountPage choice={3}/>} />
            <Route path="/Account/listings/update/:id" element={<RegisterListing newListing={false}/>} />


            <Route path="/Account/admin/listings" element={<RegisterListing/>} />

            <Route path="/listing/:id" element={<ListingDetailsPage />} />




            <Route path="/test" element={<RegisterListing />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;
