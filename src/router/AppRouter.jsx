import { publicRoutes, adminRoutes, userRoutes } from "../router/routes";
import { useContext } from "react";
import { AuthContext } from "../context/context";
import {Navigate, Route, Routes} from "react-router-dom";
import AdminNavbar from "../components/UI/Nav/AdminNavbar";
import UserNavbar from "../components/UI/Nav/UserNavbar";


const AppRouter = () => {
    const {isAuth, isAdmin} = useContext(AuthContext);

    console.log(isAuth);
    console.log(isAdmin);
    return (
        isAuth ? 
        isAdmin ?
        <Routes>
            {/* <Route path="*" element={}/> */}
            {adminRoutes.map(route => 
                <Route
                    path={route.path} 
                    element={<><AdminNavbar/><route.component/></>}
                    exact={route.exact}
                    key={route.path}
                />
            )}
            <Route path="*" element={<Navigate to='/about'/>}/>
        </Routes> 
        :
        <Routes>
            <Route path="*" element={<UserNavbar/>}/>
            {userRoutes.map(route => 
                <Route
                    path={route.path} 
                    element={<route.component/>}
                    exact={route.exact}
                    key={route.path}
                />
            )}
            <Route path="*" element={<Navigate to='/about'/>}/>
        </Routes> 
        :
        <div>
            <Routes>
                {publicRoutes.map(route => 
                    <Route
                        path={route.path} 
                        element={<route.component/>}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route path="*" element={<Navigate to='/sign-in'/>}/>
            </Routes>
        </div>
        
    )
}

export default AppRouter;