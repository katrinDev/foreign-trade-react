// import React, { useState } from "react";
// import {
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   FormControl,
//   InputLabel,
//   Box,
// } from "@material-ui/core";
// import { DataGrid } from "@mui/x-data-grid";
// import { useEffect } from "react";
// import companyRepository from "../repositories/companyRepository";
// import itemRepository from "../repositories/itemRepository";
// import { GridActionsCellItem } from "@mui/x-data-grid-pro";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import Link from "@mui/material/Link";

// import DeleteIcon from "@mui/icons-material/Delete";
// import { makeStyles } from "@mui/styles";
// import { createTheme } from "@mui/material/styles";
// import tradesService from "../services/tradesService";

// const defaultTheme = createTheme();

// const useStyles = makeStyles(
//   (theme) => ({
//     root: {
//       display: "flex",
//       justifyContent: "center",
//       "& .MuiDataGrid-cell": {
//         fontSize: "15px",
//       },
//       "& .MuiDataGrid-columnHeader": {
//         fontSize: "16px",
//         fontWeight: "bold",
//       },
//       "& .MuiDataGrid-columnHeaderTitle": {
//         fontSize: "16px",
//         fontWeight: "bold",
//       },
//     },
//   }),
//   { defaultTheme }
// );

// export function MyTradeForm(props) {
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [chosenCompany, setChosenCompany] = useState("");
//   const [rows, setRows] = useState([]);
//   const classes = useStyles();

//   const [chosenItem, setChosenItem] = useState("");
//   const [amount, setAmount] = useState(0);

//   const [companies, setCompanies] = useState([]);
//   const [items, setItems] = useState([]);

//   const [snackbarProps, setSnackbarProps] = useState({
//     open: false,
//     severity: "error",
//     message: "",
//   });

//   function getCompanies() {
//     companyRepository
//       .getCompanies()
//       .then((response) => {
//         console.log(response.data);

//         let allCompanies = response.data;
//         let filteredCompanies = allCompanies.filter(
//           (company) => company.tradeType.tradeTypeId === props.tradeType
//         );
//         setCompanies(filteredCompanies);

//         console.log(filteredCompanies);
//       })
//       .catch((error) => {
//         setSnackbarProps({
//           open: true,
//           severity: "error",
//           message: error.response?.data.message || error.message,
//         });
//       });
//   }

//   function getItems() {
//     itemRepository
//       .getItems()
//       .then((response) => {
//         console.log(response.data);

//         let allItems = response.data;
//         let filteredItems = allItems.filter(
//           (item) => item.tradeType.tradeTypeId === props.tradeType
//         );

//         setItems(filteredItems);

//         console.log(filteredItems);
//       })
//       .catch((error) => {
//         setSnackbarProps({
//           open: true,
//           severity: "error",
//           message: error.response?.data.message || error.message,
//         });
//       });
//   }

//   useEffect(() => {
//     getCompanies();
//     getItems();
//   }, []);

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }

//     setSnackbarProps({ ...snackbarProps, open: false });
//   };

//   const handleDeleteClick = (id) => () => {
//     setRows(rows.filter((row) => row.id !== id));
//   };

//   const handleProcessRowUpdateError = (error) => {
//     console.log(error.message);
//   };

//   const [index, setIndex] = useState(1);

//   const handleAddClick = () => {
//     setIndex(index + 1);
//     setRows((oldRows) => [
//       ...oldRows,
//       { id: index, item: chosenItem, amount: amount },
//     ]);
//     setChosenItem("");
//     setAmount("");
//   };

//   const columns = [
//     { field: "id", headerName: "ID", width: 100, editable: false },
//     {
//       field: "item",
//       headerName: "Продукт",
//       width: 300,
//       editable: false,
//     },
//     {
//       field: "amount",
//       headerName: "Количество",
//       type: "number",
//       width: 150,
//       editable: false,
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: 100,
//       cellClassName: "actions",
//       getActions: ({ id }) => {
//         return [
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={handleDeleteClick(id)}
//             color="inherit"
//           />,
//         ];
//       },
//     },
//   ];

//   const handleSubmit = () => {
//     console.log("Delivery Date:", deliveryDate);
//     console.log("Company:", chosenCompany);
//     console.log("Rows:", rows);

//     let newOrders = rows.map((order) => ({
//       item: {
//         itemName: order.item,
//       },
//       itemsAmount: order.amount,
//     }));

//     let currentUser = JSON.parse(localStorage.getItem("user"));
//     console.log(currentUser);
//     const id = currentUser.userId;

//     const newTrade = {
//       supplyDate: deliveryDate,
//       company: {
//         companyName: chosenCompany,
//       },
//       orders: newOrders,
//       tradeType: {
//         tradeTypeId: props.tradeType,
//       }
//     };

//     tradesService.addTrade({ newTrade, id, setSnackbarProps });
//     setDeliveryDate("");
//     setChosenCompany("");
//     setRows([]);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginTop: "30px",
//         minHeight: 400,
//         width: "100%",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-around",
//           minWidth: "700px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-around",
//             marginBottom: "40px",
//           }}
//         >
//           <FormControl sx={{ minWidth: 300, margin: 20 }}>
//             <InputLabel>Продукт</InputLabel>
//             <Select
//               labelId="status-select-label"
//               id="status-select"
//               value={chosenItem}
//               onChange={(event) => setChosenItem(event.target.value)}
//             >
//               {items.map((item) => (
//                 <MenuItem key={item.itemId} value={item.itemName}>
//                   {item.itemName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             type="number"
//             label="Количество"
//             value={amount}
//             onChange={(event) => setAmount(event.target.value)}
//           />
//           <Button variant="contained" color="primary" onClick={handleAddClick}>
//             Добавить
//           </Button>
//         </div>
//         <DataGrid
//           sx={{ margin: "20px", marginTop: "0px" }}
//           rows={rows}
//           columns={columns}
//           classes={classes}
//           rowHeight={38}
//           onProcessRowUpdateError={handleProcessRowUpdateError}
//         />
//       </div>

//       {
//         <Snackbar
//           open={snackbarProps.open}
//           autoHideDuration={6000}
//           onClose={handleClose}
//         >
//           <Alert
//             onClose={handleClose}
//             severity={snackbarProps.severity}
//             sx={{ width: "100%" }}
//           >
//             {snackbarProps.message}
//           </Alert>
//         </Snackbar>
//       }

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-around",
//           margin: "55px",
//         }}
//       >
//         <TextField
//           sx={{ margin: "30px" }}
//           label="Дата поставки"
//           type="date"
//           value={deliveryDate}
//           onChange={(event) => setDeliveryDate(event.target.value)}
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <FormControl sx={{ minWidth: 300, margin: "20" }}>
//           <InputLabel>Компания</InputLabel>
//           <Select
//             sx={{ minWidth: 300 }}
//             value={chosenCompany}
//             onChange={(event) => setChosenCompany(event.target.value)}
//             required
//           >
//             {companies.map((company) => (
//               <MenuItem key={company.companyId} value={company.companyName}>
//                 {company.companyName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button variant="contained" color="primary" onClick={handleSubmit}>
//           Подтвердить
//         </Button>

//         <Link
//           onClick={() => props.setShowForm(false)}
//           variant="body2"
//           sx={{ display: "flex", marginTop: "10px", justifyContent: "center" }}
//         >
//           {"Список внешнеторговых операций"}
//         </Link>
//       </div>
//     </Box>
//   );
// }
