import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";

import {
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import userService from "../../services/userService";
import { useEffect,  useState} from "react";
import { ROLES } from "../../helpers/enum";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


export default function UsersCrudGrid() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  let serverAnswer = "";


  function updateUser(updatedUser) {
    userService
      .updateUser({
        userId: updatedUser.id,
        username: updatedUser.username,
        role: { roleName: updatedUser.role },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Роль пользователя ${response.data.username} успешно изменена!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

          setSnackbarProps({
            open: true,
            severity: "error",
            message: serverAnswer,
          });
      });

      setSnackbarProps({ open: false, severity: "error", message: "" });
  }
  
  function deleteUser(id) {
    userService
      .deleteUser(id)
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Аккаунт пользователя ${response.data.username} успешно удален!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

          setSnackbarProps({
            open: true,
            severity: "error",
            message: serverAnswer,
          });
      });

      setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  
  function getNewRole(editingRow) {
    const newRole = editingRow.role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN;

    return newRole;
  }

  useEffect(() => {
    userService
      .getUsers()
      .then((response) => {
        setAllUsers(response.data);

        setRows(
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    const editingRow = rows.find((row) => row.id === id);

    const newRole = editingRow.role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN;

    setRows(
      rows.map((row) =>
        row.id === editingRow.id ? { ...row, role: newRole } : row
      )
    );

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const editingRow = rows.find((row) => row.id === id);

    console.log("save edit click all: ", rows);

    updateUser(editingRow);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));

    deleteUser(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    const oldRole = getNewRole(editedRow);

    setRows(
      rows.map((row) => (row.id === id ? { ...row, role: oldRole } : row))
    );
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60, editable: false },
    {
      field: "username",
      headerName: "Логин",
      width: 130,
      editable: false,
    },
    {
      field: "role",
      headerName: "Роль",
      width: 130,
      editable: false,
    },
    {
      field: "fullName",
      headerName: "Сотрудник",
      editable: false,
      width: 260,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[7]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
      />
      {
        <Snackbar
          open={snackbarProps.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackbarProps.severity}
            sx={{ width: "100%" }}
          >
            {snackbarProps.message}
          </Alert>
        </Snackbar>
      }
    </Box>
  );
}
