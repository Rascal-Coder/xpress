import type { ColDef } from 'ag-grid-community';

import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';

interface RowDataType {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

const MenuPage = () => {
  // Row Data: The data to be displayed.
  const [rowData] = useState<RowDataType[]>([
    { make: 'Tesla', model: 'Model Y', price: 64_950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33_850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29_600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [columnDefs] = useState<ColDef<RowDataType>[]>([
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      field: 'electric',
      sortable: true,
      filter: true,
      cellRenderer: (params: { value: boolean }) =>
        params.value ? '是' : '否',
    },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        pagination={true}
        paginationAutoPageSize={true}
        rowData={rowData}
      />
    </div>
  );
};

export default MenuPage;
