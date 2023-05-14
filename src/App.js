import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AuthContext } from "./context/context";
import "./styles/App.css";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {  
      setIsAuth(true);
      if (currentUser.role?.roleId === 1) {
        setIsAdmin(true);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        isAdmin,
        setIsAdmin,
      }}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
