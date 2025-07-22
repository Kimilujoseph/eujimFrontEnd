import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const UserTable = ({
    users,
    columns,
    loading,
    paginationModel,
    onPaginationModelChange,
    colors,
}) => {
    return (
        <div className="w-full mt-10 h-[75vh] overflow-x-auto">
            <DataGrid
                rows={users}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                slots={{
                    loadingOverlay: LinearProgress,
                }}
                sx={{
                    '& .MuiDataGrid-root': { border: 'none' },
                    '& .MuiDataGrid-cell': { borderBottom: 'none' },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400],
                        willChange: 'transform',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                        backgroundColor: colors.blueAccent[700],
                    },
                }}
            />
        </div>
    );
};

export default UserTable;
