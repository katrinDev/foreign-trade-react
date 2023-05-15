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



export function CompaniesGridUser() {
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


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
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
    
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={38}
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
