import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../JS/action/clientActions';
import { DataGrid } from '@mui/x-data-grid';

const ClientsList = () => {
  const dispatch = useDispatch();
  const { clients, loading } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'firstname', headerName: 'Prénom', width: 150 },
    { field: 'lastname', headerName: 'Nom', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'createdAt', headerName: 'Date création', width: 180 },
  ];

  const rows = clients.map(client => ({
    id: client._id,
    ...client,
    createdAt: new Date(client.createdAt).toLocaleDateString()
  }));

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        loading={loading}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
};

export default ClientsList;