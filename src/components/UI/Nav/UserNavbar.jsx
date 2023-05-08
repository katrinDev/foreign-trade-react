import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../../../context/context";
import Button from '@mui/material/Button';


const UserNavbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('user')
    }

    return (
        <div className="navbar">
            <div className="navbar__links">
                <Link to="/about">О сайте</Link>
                <Link to="/export-trades">Экспортные операции</Link>
                <Link to="/import-trades">Импортные операции</Link>
                <Link to="/companies">Компании-партнеры</Link>
                <Link to="/items">Товары</Link>
            </div>
            <Button onClick={logout}>
                Выйти
            </Button>
        </div>
    );
};

export default UserNavbar;