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
import { Select, MenuItem } from '@mui/material';

import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import { useEffect } from "react";
import { useState } from "react";
import itemService from "../../services/itemRepository";

function AddToolbar(props) {
  const { setRows, setRowModesModel, setIsEditableCell, allItems } = props;

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
  setIsEditableCell: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired,
};

export default function ItemsCrudGrid() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isEditableCell, setIsEditableCell] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  let serverAnswer = "";

  function getItems() {
    itemService
      .getItems()
      .then((response) => {
        setAllItems(response.data);

        console.log(response.data);
        setRows(
          response.data.map((item) => ({
            id: item.itemId,
            name: item.itemName,
            cost: item.itemCost,
            type: item.tradeType.tradeTypeName,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateItem(updatedItem) {
    itemService
      .updateItem({
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        itemCost: updatedItem.cost,
        tradeType: {
            tradeTypeName: updatedItem.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные товара ${response.data.itemName} успешно изменены!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });

        getItems();
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  function addItem(newItem) {
    itemService
      .addItem({
        itemName: newItem.name,
        itemCost: newItem.cost,
        tradeType: {
            tradeTypeName: newItem.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Товар ${response.data.itemName} успешно добавлен!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });

        getItems();
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  function deleteItem(id) {
    itemService
      .deleteItem(id)
      .then((response) => {
        console.log("После удаления: ", response);
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные о товаре ${response.data.itemName} успешно удалены!`,
        });
      })
      .catch((error) => {
        serverAnswer = error.response?.data.message;

        setSnackbarProps({
          open: true,
          severity: "error",
          message: serverAnswer,
        });

        getItems();
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  useEffect(getItems, []);

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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEditableCell(false);
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setIsEditableCell(false);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    deleteItem(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setIsEditableCell(false);
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (updatedRow) => {
    console.log("Proccess updatedRow: ", updatedRow);

    setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    updatedRow.isNew ? addItem(updatedRow) : updateItem(updatedRow);

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60, editable: false },
    {
      field: "name",
      headerName: "Название",
      width: 340,
      editable: { isEditableCell },
    },
    {
      field: "type",
      headerName: "Тип товара",
      width: 130,
      editable: { isEditableCell },
      renderEditCell: (params) => (
        <Select
          labelId="status-select-label"
          id="status-select"
          value={params.value}

          onChange={(event) => {
            params.api.commitCellChange({
                id: params.id,
                field: params.field,
                props: { value: event.target.value },
              });
              params.api.setCellMode(params.id, params.field, 'view');
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
      editable: true,
      type: "number",
      width: 110,
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
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            setIsEditableCell,
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
    </Box>
  );
}
