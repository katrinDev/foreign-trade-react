import About from "../pages/About";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Companies from "../pages/privatePages/Companies";
import Employees from "../pages/privatePages/onlyAdminPages/Employees";
import Items from "../pages/privatePages/Items";
import Users from "../pages/privatePages/onlyAdminPages/Users";
import ExportTrades from "../pages/privatePages/ExportTrades";
import ImportTrades from "../pages/privatePages/ImportTrades";


export const adminRoutes = [
    {path: '/about', component: About, exact: true},
    {path: '/users', component: Users, exact: true},
    {path: '/employees', component: Employees, exact: true},
    {path: '/companies', component: Companies, exact: true},
    {path: '/items', component: Items, exact: true},
]

export const userRoutes = [
    {path: '/about', component: About, exact: true},
    {path: '/companies', component: Companies, exact: true},
    {path: '/items', component: Items, exact: true},
    {path: '/export-trades', component: ExportTrades, exact: true},
    {path: '/import-trades', component: ImportTrades, exact: true},
]

export const publicRoutes = [
   {path: '/sign-in', component: SignIn, exact: true},
   {path: '/sign-up', component: SignUp, exact: true},
]