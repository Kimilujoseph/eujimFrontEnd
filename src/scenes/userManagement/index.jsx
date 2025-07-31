import React, { useState, useEffect } from 'react';
import { useTheme, Button, TextField, Snackbar, Alert, Menu, MenuItem, Dialog } from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, RestoreFromTrash as RestoreIcon, Description as DocumentsIcon, CheckCircle as VerifiedIcon, Pending as PendingIcon, Block as SuspendedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useUserManagement } from './hooks/useUserManagement';
import { getColumns } from './columns.jsx';
import UserTable from './UserTable';
import CreateUserDialog from './CreateUserDialog';
import ActionConfirmationDialog from './ActionConfirmationDialog';
import { DocumentsManager } from '../../components/employer/documentUpload';
import api from '../../api/api';

const UserManagement = ({ role, title, includeDeleted = true }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { user } = useAuth();

    const { users, loading, fetchUsers, handleStatusUpdate, snackbar, setSnackbar } = useUserManagement(role, includeDeleted);

    const [searchTerm, setSearchTerm] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDocumentsModal, setOpenDocumentsModal] = useState(false);
    const [selectedEmployerId, setSelectedEmployerId] = useState(null);

    const [createFormData, setCreateFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [createErrors, setCreateErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleViewProfile = (userToView) => {
        if (user?.role === 'admin' || user?.role === 'superAdmin') {
            if (role === 'jobseeker') {
                navigate(`/job-seeker-dashboard/${userToView.id}/${userToView.firstName}`);
            } else if (role === 'employer') {
                navigate(`/employer-dashboard/${userToView.id}/${userToView.companyName || 'No Company Name'}`);
            }
        } else {
            setSnackbar({ open: true, message: "You don't have permission to view this profile", severity: 'error' });
        }
        handleMenuClose();
    };

    const handleViewDocuments = (userId) => {
        setSelectedEmployerId(userId);
        setOpenDocumentsModal(true);
        handleMenuClose();
    };

    const handleActionClick = (type, userToAction) => {
        setActionType(type);
        setSelectedUser(userToAction);
        setOpenDialog(true);
        handleMenuClose();
    };

    const handleConfirmAction = () => {
        handleStatusUpdate(selectedUser, actionType);
        setOpenDialog(false);
    };

    const handleCreateUserSubmit = async (e) => {
        e.preventDefault();
        setCreateErrors({});
        try {
            await api.post('/auth/register', { ...createFormData, role });
            setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
            setOpenCreateModal(false);
            fetchUsers();
            setCreateFormData({ firstName: '', lastName: '', email: '', password: '' });
        } catch (err) {
            // Error handling logic remains the same
        }
    };

    const columns = getColumns({
        colors,
        handleMenuClick,
    });

    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            (user.role && user.role.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="m-5">
            <Header
                title={title || `${role.toUpperCase()} MANAGEMENT`}
                subtitle={
                    <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                        <Button
                            variant="contained"
                            onClick={() => setOpenCreateModal(true)}
                            sx={{
                                background: colors.greenAccent[600],
                                color: colors.grey[900],
                                '&:hover': { background: colors.greenAccent[700] },
                            }}
                            className="w-full sm:w-auto"
                        >
                            Create User
                        </Button>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: colors.grey[300], mr: 1 }} />,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: colors.grey[100],
                                    '& fieldset': { borderColor: colors.grey[700] },
                                    '&:hover fieldset': { borderColor: colors.grey[500] },
                                },
                            }}
                            className="w-full sm:w-72"
                        />
                    </div>
                }
            />

            <UserTable
                users={filteredUsers}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                colors={colors}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleViewProfile(selectedRow)}>
                    <VisibilityIcon className="mr-2" /> View Profile
                </MenuItem>
                {role === 'employer' && !selectedRow?.is_deleted && (
                    <MenuItem onClick={() => handleViewDocuments(selectedRow.id)}>
                        <DocumentsIcon className="mr-2" /> Verify Documents
                    </MenuItem>
                )}
                {!selectedRow?.is_deleted && [
                    <MenuItem key="suspend" onClick={() => handleActionClick('suspend', selectedRow)}>
                        {selectedRow?.is_suspended ? <VerifiedIcon className="mr-2" /> : <SuspendedIcon className="mr-2" />}
                        {selectedRow?.is_suspended ? 'Unsuspend' : 'Suspend'}
                    </MenuItem>,
                    <MenuItem key="verify" onClick={() => handleActionClick('verify', selectedRow)}>
                        {selectedRow?.isVerified ? <PendingIcon className="mr-2" /> : <VerifiedIcon className="mr-2" />}
                        {selectedRow?.isVerified ? 'Unverify' : 'Verify'}
                    </MenuItem>,
                    <MenuItem key="delete" onClick={() => handleActionClick('delete', selectedRow)}>
                        <DeleteIcon className="mr-2" /> Delete
                    </MenuItem>,
                ]}
                {selectedRow?.is_deleted && (
                    <MenuItem onClick={() => handleActionClick('restore', selectedRow)}>
                        <RestoreIcon className="mr-2" /> Restore
                    </MenuItem>
                )}
            </Menu>

            <CreateUserDialog
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSubmit={handleCreateUserSubmit}
                formData={createFormData}
                onFormChange={(e) => setCreateFormData({ ...createFormData, [e.target.name]: e.target.value })}
                errors={createErrors}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                colors={colors}
            />

            <ActionConfirmationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleConfirmAction}
                actionType={actionType}
                selectedUser={selectedUser}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={openDocumentsModal}
                onClose={() => setOpenDocumentsModal(false)}
                maxWidth="lg"
                fullWidth
            >
                <DocumentsManager
                    recruiterId={selectedEmployerId}
                    onClose={() => setOpenDocumentsModal(false)}
                />
            </Dialog>
        </div>
    );
};

export default UserManagement;
