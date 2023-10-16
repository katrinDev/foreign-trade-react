import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import companyService from "../../services/companyService";

export function CompaniesGrid() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [allCompanies, setAllCompanies] = useState([]);
  const [tradeTypeValue, setTradeTypeValue] = useState("");
  const [countryValue, setCountryValue] = useState("");

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  useEffect(() => {
    companyService.getCompanies({ setRows, setAllCompanies, setSnackbarProps });
  }, []);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    companyService.deleteCompany({ id, setSnackbarProps });
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

  const processRowUpdate = (updatedCompany) => {
    let currentRow = rows.find((row) => row.id === updatedCompany.id);

    console.log("Current row: ", currentRow);

    const realChangedObj = {
      ...updatedCompany,
      type: currentRow.type,
      country: currentRow.country,
    };

    console.log("Updated row: ", realChangedObj);

    setRows(
      rows.map((row) => (row.id === updatedCompany.id ? realChangedObj : row))
    );

    const company = {
      companyId: realChangedObj.id,
      companyName: realChangedObj.name,
      country: realChangedObj.country,
      checkingAccount: realChangedObj.account,
      companyEmail: realChangedObj.email,
      tradeType: {
        tradeTypeName: realChangedObj.type,
      },
    };

    updatedCompany.isNew
      ? companyService.addCompany({
          company,
          setSnackbarProps,
        })
      : companyService.updateCompany({
          company,
          setSnackbarProps,
        });

    return updatedCompany;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error.message);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "name",
      headerName: "Название",
      width: 130,
      editable: true,
    },
    {
      field: "country",
      headerName: "Страна",
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <Select
          labelId="status-select-label"
          id="status-select"
          value={countryValue}
          onChange={(event) => {
            setCountryValue(event.target.value);

            setRows(
              rows.map((row) => {
                return row.id === params.id
                  ? { ...row, country: event.target.value }
                  : row;
              })
            );
          }}
          fullWidth
        >
          <MenuItem value="Казахстан">Казахстан</MenuItem>
          <MenuItem value="РФ">РФ</MenuItem>
          <MenuItem value="Италия">Италия</MenuItem>
          <MenuItem value="Армения">Армения</MenuItem>
          <MenuItem value="Бельгия">Бельгия</MenuItem>
        </Select>
      ),
    },
    {
      field: "account",
      headerName: "Расчетный счет",
      width: 180,
      editable: true,
    },
    {
      field: "email",
      headerName: "Почта",
      width: 220,
      editable: true,
    },
    {
      field: "type",
      headerName: "Тип услуг",
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <Select
          labelId="status-select-label"
          id="status-select"
          value={tradeTypeValue}
          onChange={(event) => {
            setTradeTypeValue(event.target.value);
            setRows(
              rows.map((row) => {
                return row.id === params.id
                  ? { ...row, type: event.target.value }
                  : row;
              })
            );
          }}
          fullWidth
        >
          <MenuItem value="IMPORT">IMPORT</MenuItem>
          <MenuItem value="EXPORT">EXPORT</MenuItem>
        </Select>
      ),
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
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        rowHeight={38}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            allCompanies,
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
    </>
  );
}

function AddToolbar(props) {
  const { setRows, setRowModesModel, allCompanies } = props;

  const handleAddClick = () => {
    const id = allCompanies.slice(-1)[0].companyId + 1;
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        country: "",
        account: "",
        email: "",
        type: "",
        isNew: true,
      },
    ]);

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
  allCompanies: PropTypes.array.isRequired,
};
