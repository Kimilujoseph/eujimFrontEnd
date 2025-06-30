import React, { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import {
    Box,
    Alert,
    TextField,
    Button,
    CircularProgress,
    InputAdornment,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import api from "../api/api";

const RequestVerificationForm = ({ purpose = "reset" }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        try {
            const endpoint = purpose === "reset"
                ? "/auth/request-reset-password/"
                : "/auth/request-verification-code/";

            const response = await api.post(endpoint, { email });

            // Handle specific success cases
            if (response.data?.message === "Email already verified") {
                setSuccess("Your email is already verified. You can proceed to login.");
            } else {
                setSuccess(`Verification token sent to ${email}. Please check your inbox.`);
            }
        } catch (err) {
            // Handle specific error cases
            if (err.response?.data?.error === "Email not found") {
                setError("This email is not registered. Please check and try again.");
            } else {
                setError(err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to send verification email. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: colors.primary[500],
            p: 3
        }}>
            <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{
                    color: colors.greenAccent[600],
                    fontWeight: 'bold',
                    mb: 4
                }}
            >
                {purpose === "reset" ? "Reset Password" : "Request new verification code for your email"}
            </Typography>

            <Box sx={{
                width: '100%',
                maxWidth: 450,
                mb: 4
            }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            width: '100%',
                            mb: 3,
                            backgroundColor: colors.redAccent[500],
                            color: 'error.contrastText'
                        }}
                    >
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            width: '100%',
                            mb: 3,
                            backgroundColor: colors.greenAccent[600],
                            color: 'success.contrastText'
                        }}
                    >
                        {success}
                    </Alert>
                )}
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: "100%",
                    maxWidth: 450,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    p: 4,
                    backgroundColor: colors.primary[400],
                    borderRadius: 2,
                    boxShadow: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailOutlinedIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'primary.main',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.dark',
                            },
                        }
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"

                    disabled={loading}
                    sx={{
                        fontWeight: "bold",
                        py: 1.5,
                        backgroundColor: colors.greenAccent[600],
                        fontSize: '1rem',
                        textTransform: 'none',
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: colors.greenAccent[700]
                        }
                    }}
                    fullWidth
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{
                            color: colors.grey[100]
                        }} />
                    ) : (
                        purpose === "reset" ? "Send Reset Link" : "Send Verification"
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default RequestVerificationForm;