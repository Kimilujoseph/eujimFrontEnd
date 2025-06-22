import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import api from '../api/api';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.new_password !== formData.re_new_password) {
            setError("Passwords don't match");
            return;
        }

        if (formData.new_password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/auth/password-reset-confirm/${uidb64}/${token}/`, {
                new_password: formData.new_password,
                re_new_password: formData.re_new_password
            });

            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail ||
                err.response?.data?.new_password?.[0] ||
                'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 3,
                backgroundColor: colors.primary[500]
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 450,
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: colors.primary[400],
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <LockResetIcon sx={{ fontSize: 60, color: colors.greenAccent[600] }} />
                    <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
                        Set New Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Please enter your new password twice to reset it
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        inputProps={{ minLength: 8 }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm New Password"
                        name="re_new_password"
                        type="password"
                        value={formData.re_new_password}
                        onChange={handleChange}
                        required
                        inputProps={{ minLength: 8 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5, backgroundColor: colors.greenAccent[600] }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PasswordResetConfirm;