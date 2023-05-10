import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import UserService from "../../../services/userService";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 60, editable: false},
  { field: "username", headerName: "Логин", width: 130, editable: false},
  { field: "role", headerName: "Роль", width: 130, editable: true},
  { field: "fullName", headerName: "Сотрудник", editable: false, width: 260 },
];

export default function Users() {
    const [data, setData] = useState([]);

    useEffect(() => {
      UserService.getUsers()
        .then((response) => {
          console.log(response.data);
          setData(
            response.data.map((user) => ({
              id: user.userId,
              username: user.username,
              role: user.role?.roleName,
              fullName: `${user.person.name} ${user.person.patronymic} ${user.person.surname}`,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    return (
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          
        />
      </div>
    );
}



    //   const handleAddRow = () => {
    //     const newRow = {
    //       id: rows.length + 1,
    //       login: "",
    //       role: "",
    //       name: "",
    //       surname: "",
    //     };
    // setRows([...rows, newRow]);
    //   };


        {/* <Button onClick={getRows}>Get Rows</Button> */}


// onEditCellChangeCommitted={handleEditCellChangeCommitted}
          // disableSelectionOnClick


    //   const handleDeleteRow = (id) => {
    // setRows(rows.filter((row) => row.id !== id));
    //   };

    //   const handleEditCellChangeCommitted = React.useCallback(
    //     ({ id, field, props }) => {
    //       if (field === "login") {
    //         const data = props; // contains the new value
    // setRows((state) => {
    //   return state.map((row) => {
    //     if (row.id === id) {
    //       return { ...row, login: data.value };
    //     }
    //     return row;
    //   });
    // });
    //       }
    //     },
    //     []
    //   );

   
