import About from "../pages/About";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Companies from "../pages/privatePages/Companies";
import Items from "../pages/privatePages/Items";
import ExportTrades from "../pages/privatePages/ExportTrades";
import ImportTrades from "../pages/privatePages/ImportTrades";
import UsersCrudGrid from "../components/Tables/UsersCrudGrid";
import EmployeesCrudGrid from "../components/Tables/EmployeesCrudGrid";


export const adminRoutes = [
    {path: '/about', component: About, name: 'О сайте', exact: true},
    {path: '/users', component: UsersCrudGrid, name: 'Пользователи', exact: true},
    {path: '/employees', component: EmployeesCrudGrid, name: 'Сотрудники', exact: true},
    {path: '/companies', component: Companies, name: 'Компании-партнеры', exact: true},
    {path: '/items', component: Items, name: 'Товары', exact: true},
]

export const userRoutes = [
    {path: '/about', component: About, name: 'О сайте', exact: true},
    {path: '/companies', component: Companies, name: 'Компании-партнеры', exact: true},
    {path: '/items', component: Items, name: 'Товары', exact: true},
    {path: '/export-trades', component: ExportTrades, name: 'Экспортные сделки', exact: true},
    {path: '/import-trades', component: ImportTrades, name: 'Импортные сделки', exact: true},
]

export const publicRoutes = [
   {path: '/sign-in', component: SignIn, exact: true},
   {path: '/sign-up', component: SignUp, exact: true},
]