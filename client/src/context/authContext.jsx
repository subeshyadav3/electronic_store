import { createContext } from "react";
import axios from 'axios';
const AuthContext=createContext();

function AuthComponent({children}){

    


    return(
        <AuthContext.Provider value={}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;


