import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [User, SetUser] = useState(null);
  const [search, setSearch] = useState("Search destination");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const { data } = await axios.get("/api/profile");
        if (!cancelled) SetUser(data);
      } catch (err) {
        // 401 just means "not logged in" — that's a valid app state, not an
        // error worth crashing the UI over. Swallow it, and surface anything
        // else to the console for debugging.
        if (err.response?.status !== 401) {
          console.error("Profile fetch failed:", err);
        }
        if (!cancelled) SetUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ User, SetUser, ready, search, setSearch }}
    >
      {children}
    </UserContext.Provider>
  );
}
