import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import tradesService from "../../services/tradesService";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { MyTradeForm } from "../MyTradeForm";

export function ImportTradesGrid() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const tradeType = 1;

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  useEffect(() => {
    tradesService.getMyTrades({
      setRows,
      setSnackbarProps,
      tradeType,
    });
  }, [showForm]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    tradesService.deleteTrade({ id, setSnackbarProps, setRows, tradeType });
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error.message);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "company",
      headerName: "Компания",
      width: 170,
      editable: false,
    },
    {
      field: "fullCost",
      headerName: "Полная стоимость",
      width: 180,
      editable: false,
    },
    {
      field: "supplyDate",
      headerName: "Дата поставки",
      type: "date",
      width: 120,
      valueGetter: (params) => new Date(params.value),
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
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

  return showForm ? (
    <MyTradeForm
      tradeType={tradeType}
      setShowForm={setShowForm}
    />
  ) : (
    <>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
        Добавить
      </Button>

      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowHeight={38}
        onProcessRowUpdateError={handleProcessRowUpdateError}
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
