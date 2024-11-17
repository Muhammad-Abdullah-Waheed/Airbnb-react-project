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

axios.defaults.baseURL = "http://localhost:4000";
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
            <Route path="/Account" element={<AccountPage />} />

            <Route path="/listing/:id" element={<ListingDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;
