import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import api from '../../../api/api';

export const useUserManagement = (role, includeDeleted) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchUsers = useCallback(debounce(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/manage/admin/users/all?role=${role}&include_deleted=${includeDeleted}`);
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, 300), [role, includeDeleted]);

    const handleStatusUpdate = async (selectedUser, actionType) => {
        try {
            let endpoint = `/manage/admin/user/${selectedUser.id}/`;
            let method = 'post';

            switch (actionType) {
                case 'verify':
                    endpoint += 'toggle-verify';
                    break;
                case 'delete':
                    endpoint += 'delete';
                    method = 'delete';
                    break;
                case 'restore':
                    endpoint += 'restore';
                    break;
                case 'suspend':
                    endpoint += 'toggle-suspend';
                    break;
                default:
                    throw new Error('Invalid action type');
            }

            await api[method](endpoint);
            setSnackbar({ open: true, message: 'Action completed successfully', severity: 'success' });
            fetchUsers();
        } catch (err) {
            setSnackbar({ open: true, message: 'An error occurred', severity: 'error' });
        }
    };

    return {
        users,
        loading,
        error,
        fetchUsers,
        handleStatusUpdate,
        snackbar,
        setSnackbar
    };
};
