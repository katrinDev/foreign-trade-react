import { publicRoutes, adminRoutes, userRoutes } from "../router/routes";
import { useContext } from "react";
import { AuthContext } from "../context/context";
import {Navigate, Route, Routes} from "react-router-dom";
import Layout from "../components/Layout/Layout";


const AppRouter = () => {
    const {isAuth, isAdmin} = useContext(AuthContext);


    return (
        isAuth ? 
        isAdmin ?
        <Routes>
            {adminRoutes.map(route => 
                <Route
                    path={route.path} 
                    element={<Layout title={route.name}>
                                <route.component/>
                            </Layout>}
                    exact={route.exact}
                    key={route.path}
                />
            )}
            <Route path="*" element={<Navigate to='/about'/>}/>
        </Routes> 
        :
        <Routes>
            {userRoutes.map(route => 
                <Route
                    path={route.path} 
                    element={<Layout title={route.name}>
                                <route.component />
                            </Layout>}
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