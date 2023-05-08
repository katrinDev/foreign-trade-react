import React, { useContext } from "react";
import { AuthContext } from "../../../context/context";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const AdminNavbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("user");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // return (
  //     <div className="navbar">
  //         <div className="navbar__links">
  //             <Link to="/about">О сайте</Link>
  //             <Link to="/users">Пользователи</Link>
  //             <Link to="/employees">Сотрудники</Link>
  //             <Link to="/companies">Компании-партнеры</Link>
  //             <Link to="/items">Товары</Link>
  //         </div>
  //         <Button onClick={logout}>
  //             Выйти
  //         </Button>
  //     </div>
  // );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Navbar
        </Typography>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          color="inherit"
        >
          Пользователи
        </Button>
            {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
            >
            <MenuItem onClick={handleClose}>Список пользователей</MenuItem>
            <MenuItem onClick={handleClose}>Изменение роли</MenuItem>
            <MenuItem onClick={handleClose}>Добавление пользователя</MenuItem>
            <MenuItem onClick={handleClose}>Удаление пользователя</MenuItem>
            </Menu> */}
        <Button color="inherit">Link 2</Button>
        <Button color="inherit">Link 3</Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
