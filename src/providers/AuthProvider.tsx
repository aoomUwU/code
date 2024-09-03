import { useState,useContext, createContext, PropsWithChildren } from "react";

interface IAuthContext {

}

const AuthContext = createContext({} as IAuthContext)

export function useAuthContext(){
    return useContext(AuthContext);
}


function AuthProvider({children} : PropsWithChildren){


    let pvalues : IAuthContext = {

    }

    return (
        <AuthContext.Provider value={pvalues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;