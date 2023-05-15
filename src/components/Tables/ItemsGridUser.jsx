import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Select, MenuItem } from "@mui/material";

import itemService from "../../services/itemService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";



export function ItemsGridUser() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [tradeTypeValue, setTradeTypeValue] = useState("");

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  useEffect(() => {
    itemService.getItems({ setRows, setAllItems });
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
      width: 340,
      editable: true,
    },
    {
      field: "type",
      headerName: "Тип товара",
      width: 130,
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
      field: "cost",
      headerName: "Стоимость",
      type: "number",
      width: 110,
      editable: true,
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
