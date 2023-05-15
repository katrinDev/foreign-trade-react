import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import itemService from "../../services/itemService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";

function AddToolbar(props) {
  const { setRows, setRowModesModel, allItems } = props;

  const handleAddClick = () => {
    const id = allItems.slice(-1)[0].itemId + 1;
    setRows((oldRows) => [
      ...oldRows,
      { id, name: "", cost: 0, type: "", isNew: true },
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
  allItems: PropTypes.array.isRequired,
};

export function ItemsGrid() {
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
    itemService.deleteItem({ id, setSnackbarProps, setRows });
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

  const processRowUpdate = (updatedItem) => {
    let currentRow = rows.find((row) => row.id === updatedItem.id);
    const realChangedObj = { ...updatedItem, type: currentRow.type };

    console.log("Updated row: ", realChangedObj);

    setRows(
      rows.map((row) => (row.id === updatedItem.id ? realChangedObj : row))
    );

    updatedItem.isNew
      ? itemService.addItem({
          newItem: realChangedObj,
          setSnackbarProps,
          setRows,
        })
      : itemService.updateItem({
          updatedItem: realChangedObj,
          setSnackbarProps,
          setRows,
        });

    return updatedItem;
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
            allItems: allItems,
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
