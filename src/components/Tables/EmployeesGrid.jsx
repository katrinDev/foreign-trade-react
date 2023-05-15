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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import { useEffect } from "react";
import { useState } from "react";
import employeeService from "../../services/employeeService";

function AddToolbar(props) {
  const { setRows, setRowModesModel, setIsEditableCell, allEmployees } = props;

  const handleAddClick = () => {
    const id = allEmployees.slice(-1)[0].personId + 1;
    setRows((oldRows) => [
      ...oldRows,
      { id, name: "", surname: "", patronymic: "", workEmail: "", isNew: true },
    ]);
    setIsEditableCell(true);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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
  allEmployees: PropTypes.array.isRequired,
};

export default function EmployeesGrid() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isEditableCell, setIsEditableCell] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  let serverAnswer = "";

  function getEmployees() {
    employeeService
    .getEmployees()
    .then((response) => {
      setAllEmployees(response.data);

      setRows(
        response.data.map((employee) => ({
          id: employee.personId,
          name: employee.name,
          surname: employee.surname,
          patronymic: employee.patronymic,
          workEmail: employee.workEmail,
        }))
      );
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function updateEmployee(updatedEmployee) {

    employeeService
      .updateEmployee({
        personId: updatedEmployee.id,
        surname: updatedEmployee.surname,
        name: updatedEmployee.name,
        patronymic: updatedEmployee.patronymic,
        workEmail: updatedEmployee.workEmail,
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные сотрудника ${response.data.name} ${response.data.surname} успешно изменены!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });
        getEmployees();

      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  function addEmployee(newEmployee) {
    employeeService
      .addEmployee({
        surname: newEmployee.surname,
        name: newEmployee.name,
        patronymic: newEmployee.patronymic,
        workEmail: newEmployee.workEmail,
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Сотрудник ${response.data.name} ${response.data.surname} успешно добавлен!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });
        getEmployees();

      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  function deleteEmployee(id) {

    employeeService
      .deleteEmployee(id)
      .then((response) => {
        console.log("После удаления: ", response);
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные сотрудника ${response.data.name} ${response.data.surname} успешно удалены!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });
        getEmployees();
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  useEffect(getEmployees, []);

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
    setIsEditableCell(true);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    setIsEditableCell(false);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    deleteEmployee(id);
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

  const processRowUpdate = (updatedRow) => {
    console.log("Proccess updatedRow: ", updatedRow);

    setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    updatedRow.isNew ? addEmployee(updatedRow) : updateEmployee(updatedRow);

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60, editable: false },
    {
      field: "name",
      headerName: "Имя",
      width: 130,
      editable: { isEditableCell },
    },
    {
      field: "patronymic",
      headerName: "Отчество",
      editable: { isEditableCell },
      width: 160,
    },
    {
      field: "surname",
      headerName: "Фамилия",
      width: 130,
      editable: { isEditableCell },
    },
    {
      field: "workEmail",
      headerName: "Рабочая почта",
      editable: { isEditableCell },
      width: 160,
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
        pageSizeOptions={[7]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            setIsEditableCell,
            allEmployees: allEmployees,
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
