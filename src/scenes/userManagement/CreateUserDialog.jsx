import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Alert
} from '@mui/material';
import { EmailOutlined as EmailOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';

const CreateUserDialog = ({
    open,
    onClose,
    onSubmit,
    formData,
    onFormChange,
    errors,
    showPassword,
    onTogglePassword,
    colors
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={onSubmit} className="p-6 min-w-[90vw] sm:min-w-[400px]" style={{ background: colors.primary[400] }}>
                <DialogTitle className="text-center" style={{ color: colors.grey[100] }}>
                    Create New User
                </DialogTitle>
                <DialogContent>
                    {errors.non_field_errors && (
                        <Alert severity="error" className="mb-4">
                            {errors.non_field_errors}
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        label="First Name"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={onFormChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputLabelProps={{ style: { color: colors.grey[300] } }}
                        sx={{ input: { color: colors.grey[100] }, background: colors.primary[500] }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        label="Last Name"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={onFormChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        InputLabelProps={{ style: { color: colors.grey[300] } }}
                        sx={{ input: { color: colors.grey[100] }, background: colors.primary[500] }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        label="Email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={onFormChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon sx={{ color: colors.greenAccent[400] }} />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{ style: { color: colors.grey[300] } }}
                        sx={{ input: { color: colors.grey[100] }, background: colors.primary[500] }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={onFormChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={onTogglePassword} edge="end" sx={{ color: colors.greenAccent[400] }}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{ style: { color: colors.grey[300] } }}
                        sx={{ input: { color: colors.grey[100] }, background: colors.primary[500] }}
                    />
                </DialogContent>
                <DialogActions className="flex justify-center pb-0">
                    <Button onClick={onClose} style={{ color: colors.grey[300] }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" sx={{ background: colors.greenAccent[600], color: colors.grey[900], '&:hover': { background: colors.greenAccent[700] } }}>
                        Create User
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateUserDialog;
