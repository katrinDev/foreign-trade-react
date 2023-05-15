import About from "../pages/About";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { ItemsGrid } from "../components/Tables/ItemsGrid";
import { CompaniesGrid } from "../components/Tables/CompaniesGrid";
import EmployeesGrid from "../components/Tables/EmployeesGrid";
import UsersGrid from "../components/Tables/UsersGrid";
import { ExportTradesGrid, TradesGrid } from "../components/Tables/ExportTradesGrid";
import { ImportTradesGrid } from "../components/Tables/ImportTradesGrid";
import { CompaniesGridUser } from "../components/Tables/CompaniesGridUser";
import { ItemsGridUser } from "../components/Tables/ItemsGridUser";

export const adminRoutes = [
  { path: "/about", component: About, name: "О сайте", exact: true },
  {
    path: "/users",
    component: UsersGrid,
    name: "Пользователи",
    exact: true,
  },
  {
    path: "/employees",
    component: EmployeesGrid,
    name: "Сотрудники",
    exact: true,
  },
  {
    path: "/companies",
    component: CompaniesGrid,
    name: "Компании-партнеры",
    exact: true,
  },
  { path: "/items", component: ItemsGrid, name: "Товары", exact: true },
];

export const userRoutes = [
  { path: "/about", component: About, name: "О сайте", exact: true },
  {
    path: "/companies",
    component: CompaniesGridUser,
    name: "Компании-партнеры",
    exact: true,
  },
  { path: "/items", component: ItemsGridUser, name: "Товары", exact: true },
  {
    path: "/export-trades",
    component: ExportTradesGrid,
    name: "Экспортные сделки",
    exact: true,
  },
  {
    path: "/import-trades",
    component: ImportTradesGrid,
    name: "Импортные сделки",
    exact: true,
  },
];

export const publicRoutes = [
  { path: "/sign-in", component: SignIn, exact: true },
  { path: "/sign-up", component: SignUp, exact: true },
];
