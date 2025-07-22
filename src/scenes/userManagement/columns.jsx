import React from 'react';
import { Chip, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as VerifiedIcon,
    Pending as PendingIcon,
    Block as SuspendedIcon,
    Delete as DeleteIcon,
    RestoreFromTrash as RestoreIcon,
    Description as DocumentsIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';

const getRoleIcon = (role) => {
    switch (role) {
        case 'superAdmin':
        case 'admin':
            return <AdminIcon />;
        case 'employer':
            return <BusinessIcon />;
        case 'jobseeker':
            return <PersonIcon />;
        default:
            return <PersonIcon />;
    }
};

export const getColumns = ({
    colors,
    handleMenuClick,
    handleViewProfile,
    handleViewDocuments,
    setActionType,
    setSelectedUser,
    setOpenDialog,
    role
}) => [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
            <div className="flex items-center gap-2">
                <Avatar
                    className="w-8 h-8 text-sm"
                    sx={{ bgcolor: colors.greenAccent[500] }}
                >
                    {params.row.firstName?.charAt(0)}
                    {params.row.lastName?.charAt(0)}
                </Avatar>
                <span>
                    {params.row.firstName} {params.row.lastName}
                    {params.row.is_deleted && ' (Deleted)'}
                </span>
            </div>
        ),
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
        field: 'role',
        headerName: 'Role',
        flex: 0.8,
        renderCell: (params) => (
            <div className="flex items-center gap-1">
                {getRoleIcon(params.row.role)}
                {params.row.role || 'N/A'}
            </div>
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
            <div className="flex flex-wrap items-center gap-1 mt-3 overflow-visible">
                <Chip
                    icon={params.row.isVerified ? <VerifiedIcon /> : <PendingIcon />}
                    label={params.row.isVerified ? 'Verified' : 'Pending'}
                    color={params.row.isVerified ? 'success' : 'warning'}
                    size="small"
                />
                <Chip
                    icon={params.row.is_suspended ? <SuspendedIcon /> : <VerifiedIcon />}
                    label={params.row.is_suspended ? 'Suspended' : 'Active'}
                    color={params.row.is_suspended ? 'error' : 'success'}
                    size="small"
                />
                {params.row.is_deleted && (
                    <Chip icon={<DeleteIcon />} label="Deleted" color="error" size="small" />
                )}
            </div>
        ),
    },
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params) => (
            <div>
                <IconButton
                    onClick={(e) => handleMenuClick(e, params.row)}
                    sx={{ color: colors.grey[100] }}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>
        ),
    },
];
