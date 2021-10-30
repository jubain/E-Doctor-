import React, { createContext, useState } from "react";

const HistoryContext = createContext()

export const HistoryProvider = ({ children }) => {
    const [history, sethistory] = useState()

    const getHistory = (history) => {
        sethistory(history)
    }

    return <HistoryContext.Provider value={{ history, getHistory }}>
        {children}
    </HistoryContext.Provider>
}

export default HistoryContext