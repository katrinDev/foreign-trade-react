import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const columns = [
  { field: 'login', headerName: 'Login', width: 150 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'surname', headerName: 'Surname', width: 150 },
];

export default function Table() {
  const [rows, setRows] = React.useState([
    { id: 1, login: 'user1', role: 'admin', name: 'John', surname: 'Doe' },
    { id: 2, login: 'user2', role: 'user', name: 'Jane', surname: 'Doe' },
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      login: '',
      role: '',
      name: '',
      surname: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      if (field === 'login') {
        const data = props; // contains the new value
        setRows((state) => {
          return state.map((row) => {
            if (row.id === id) {
              return { ...row, login: data.value };
            }
            return row;
          });
        });
      }
    },
    []
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button onClick={handleAddRow}>Add row</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        disableSelectionOnClick
      />
    </div>
  );
}