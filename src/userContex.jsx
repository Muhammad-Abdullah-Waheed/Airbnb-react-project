import axios from "axios";
import { createContext, useEffect, useState } from "react";



export const UserContex = createContext({});

export function UserContextProvider({children}){
    const [User ,setUser] = useState();

    // useEffect(() => {
    //     if (!User) {
    //       const fetchUser = async () => {
    //         try {
    //           const response = await axios.get('/api/profile');
    //           setUser(response.data);
    //         } catch (error) {
    //           console.error("Error fetching user data:", error);
    //         }
    //       };
    //       fetchUser();
    //     }
    //   }, []);
      


    return (
        <UserContex.Provider value={{User ,setUser}}>
            {children}
        </UserContex.Provider>
    );
}