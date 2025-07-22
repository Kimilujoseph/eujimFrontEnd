import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

const ActionConfirmationDialog = ({ open, onClose, onConfirm, actionType, selectedUser }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to {actionType} user: {selectedUser?.email}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionConfirmationDialog;
