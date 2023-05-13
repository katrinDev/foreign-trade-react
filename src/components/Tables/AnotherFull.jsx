import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";

import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import userService from "../../services/userService";
import { useEffect } from "react";
import { useState } from "react";
import { ROLES } from "../../helpers/enum";

function AddToolbar(props) {
  const { setRows, setRowModesModel, setIsEditableCell, allUsers } = props;

  const handleAddClick = () => {
    const id = allUsers.slice(-1)[0].userId + 1;
    setRows((oldRows) => [
      ...oldRows,
      { id, username: "", role: "", fullName: "", isNew: true },
    ]);
    setIsEditableCell(true);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "username" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
        Добавить
      </Button>
    </GridToolbarContainer>
  );
}

AddToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  setIsEditableCell: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired,
};

function addUser(newUser) {
  userService.addUser({ })
}

function updateUser() {
}

export default function AnotherFull() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isEditableCell, setIsEditableCell] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

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
    setIsEditableCell(false);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const editingRow = rows.find((row) => row.id === id);

    console.log("save edit click: ", editingRow);
    console.log("save edit click allllll: ", rows);

    editingRow.isNew ? addUser(editingRow) : updateUser(editingRow);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    //!!!!!!!!!!!!!!!!!!!

    // console.log(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60, editable: { isEditableCell } },
    {
      field: "username",
      headerName: "Логин",
      width: 130,
      editable: { isEditableCell },
    },
    {
      field: "role",
      headerName: "Роль",
      width: 130,
      editable: { isEditableCell },
    },
    {
      field: "fullName",
      headerName: "Сотрудник",
      editable: { isEditableCell },
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
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, setIsEditableCell, allUsers },
        }}
      />
    </Box>
  );
}
