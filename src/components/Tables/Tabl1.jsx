import * as React from 'react';
import Box from '@mui/material/Box';
import {
  GridToolbar,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function Table1() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    visibleFields: [
      'commodity',
      'quantity',
      'filledQuantity',
      'status',
      'isFilled',
      'unitPrice',
      'unitPriceCurrency',
      'subTotal',
      'feeRate',
      'feeAmount',
      'incoTerm',
    ],
  });
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['commodity'],
      },
      sorting: {
        sortModel: [{ field: '__row_group_by_columns_group__', sort: 'asc' }],
      },
    },
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        {...data}
        apiRef={apiRef}
        loading={loading}
        disableRowSelectionOnClick
        initialState={initialState}
        slots={{ toolbar: GridToolbar }}
      />
    </Box>
  );
}