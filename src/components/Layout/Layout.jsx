import React from "react";
import AdminNavbar from "../UI/Nav/AdminNavbar";
import { useContext } from "react";
import { AuthContext } from "../../context/context";
import UserNavbar from "../UI/Nav/UserNavbar";

export default function Layout({ children, ...props }) {
  const { isAdmin } = useContext(AuthContext);

  return isAdmin ? (
    <>
      <AdminNavbar />
      <h1 style={{ padding: "20px" }}>{props.title}</h1>
      <div style={{ padding: '20px' }}>{children}</div>
    </>
  ) : (
    <>
      <UserNavbar />
      <h1 style={{ padding: "10px", marginTop: "20px"}}>{props.title}</h1>
      <div style={{ padding: '20px', minWidth: "700px", minHeight: "800px"}}>{children}</div>
    </>
  );
}
