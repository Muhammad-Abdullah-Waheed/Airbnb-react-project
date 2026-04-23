import React, { useContext, useEffect, useState } from "react";
import Filter from "../components/filters/filter";
import { list2 } from "../components/Card/cardlist";
import Footer from "../components/footer/footer";
import Cards from "../components/Card/Cards.jsx";
import Navbar from "../components/Navbar/navbar";
import axios from "axios";
import { UserContext } from "../userContex.jsx";

const HomePage = () => {
  const [listings, setListings] = useState([]);

  const { search, User } = useContext(UserContext);

  // Debounce the search so we only hit the API after the user pauses typing.
  // Also uses an `ignore` flag to avoid race conditions where an older response
  // arrives after a newer one.
  useEffect(() => {
    let ignore = false;

    const fetchListings = async () => {
      try {
        if (search === "Search destination" || !search) {
          const response = await axios.get("/api/listings");
          if (!ignore) setListings(response.data.listings || []);
        } else {
          const response = await axios.get(
            `/api/listings/search/${encodeURIComponent(search)}`
          );
          if (!ignore) setListings(response.data || []);
        }
      } catch (err) {
        if (!ignore) {
          // 404 from search means "no results" — render an empty list, don't crash.
          if (err.response?.status === 404) {
            setListings([]);
          } else {
            console.error("Error fetching listings:", err);
          }
        }
      }
    };

    const timer = setTimeout(fetchListings, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="flex flex-col">
      <Navbar />
      <Filter />
      <div className="mt-40">
        {listings && User && User.role === "admin" && (
          <Cards list={listings} showbuttons={true} />
        )}
        {listings && User && User.role !== "admin" && <Cards list={listings} />}
        {listings && !User && <Cards list={listings} />}

        <Cards list={list2} />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
