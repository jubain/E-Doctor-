import React, { createContext, useState } from "react";

const LoginContext = createContext()

export const LoginProvider = ({ children }) => {
    const [userDetail, setuserDetail] = useState({})

    const getCurrentUser = (currentuserDetail) => {
        setuserDetail(currentuserDetail)
    }

    

    return <LoginContext.Provider value={{ userDetail, getCurrentUser }}>
        {children}
    </LoginContext.Provider>
}

export default LoginContext