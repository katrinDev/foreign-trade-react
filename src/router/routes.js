import About from "../pages/About";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Companies from "../pages/privatePages/Companies";
import Employees from "../pages/privatePages/onlyAdminPages/Employees";
import Items from "../pages/privatePages/Items";
import Users from "../pages/privatePages/onlyAdminPages/Users";
import ExportTrades from "../pages/privatePages/ExportTrades";
import ImportTrades from "../pages/privatePages/ImportTrades";
import FullFeaturedCrudGrid from "../components/Tables/FullFeaturedCrudGrid";


export const adminRoutes = [
    {path: '/about', component: About, name: 'О сайте', exact: true},
    {path: '/users', component: FullFeaturedCrudGrid, name: 'Пользователи', exact: true},
    {path: '/employees', component: Employees, name: 'Сотрудники', exact: true},
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