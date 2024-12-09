import {createContext, useEffect, useState} from "react";
import axios from "axios";
// import {data} from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [User,SetUser] = useState(null);
  const [ready,setReady] = useState(false);
  
  useEffect(() => {
    if (!User) {
      axios.get('/api/profile').then(({data}) => {
        SetUser(data);
        setReady(true);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{User: User,SetUser: SetUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}