import React, { useContext } from "react";
import { AuthContext } from "../../../context/context";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import { adminRoutes } from "../../../router/routes";
import { useNavigate } from "react-router-dom";


const AdminNavbar = () => {
  const { setIsAuth, setIsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setIsAuth(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Foreign Trade App
        </Typography>
        {
            adminRoutes.map(route => 
                <Button
                    onClick={() => navigate(`${route.path}`)} 
                    key={route.path}
                    color="inherit"
                > {route.name}
                </Button>
            )
        }
        <Button
            onClick={logout} 
            color="inherit"
        > Выйти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
