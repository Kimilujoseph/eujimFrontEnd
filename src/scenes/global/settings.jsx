import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
    useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useAuth } from '../../auth/authContext';
import { tokens } from '../../theme';

const SettingsPage = () => {
    const { user } = useAuth();
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
    } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        watch: watchPassword,
        reset: resetPassword,
    } = useForm();

    // Handle profile update
    const onSubmitProfile = async (data) => {
        if (!user || !user.id) {
            setError("User not found. Please log in again.");
            return;
        }
        try {
            setLoading(true);
            const response = await api.put(`/manage/users/${user.id}/update-names`, {
                first_name: data.firstName,
                last_name: data.lastName,
            });
            setSuccess("Profile updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const onSubmitPassword = async (data) => {
        try {
            setLoading(true);
            await api.post("/api/v1/user/change-password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            setSuccess("Password changed successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const uploadAvatar = async () => {
        if (!avatar) return;

        const formData = new FormData();
        formData.append("avatar", avatar);

        try {
            setLoading(true);
            const response = await api.patch("/api/v1/user/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess("Profile picture updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update profile picture");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>

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

            {/* Profile Section */}
            <Box component="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box
                    component="form"
                    onSubmit={handleSubmitProfile(onSubmitProfile)}
                    sx={{ maxWidth: 500 }}
                >
                    <TextField
                        fullWidth
                        label="First Name"
                        margin="normal"
                        {...registerProfile("firstName", { required: "First name is required" })}
                        error={!!profileErrors.firstName}
                        helperText={profileErrors.firstName?.message}
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        margin="normal"
                        {...registerProfile("lastName", { required: "Last name is required" })}
                        error={!!profileErrors.lastName}
                        helperText={profileErrors.lastName?.message}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        {...registerProfile("email")}
                        disabled
                        InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={{ backgroundColor: colors.greenAccent[500] }}
                        >
                            {loading ? <CircularProgress sx={{ color: colors.greenAccent[500] }} size={25} /> : "Update Profile"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Password Section */}
            <Box component="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Change Password
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box
                    component="form"
                    onSubmit={handleSubmitPassword(onSubmitPassword)}
                    sx={{ maxWidth: 500 }}
                >
                    <TextField
                        fullWidth
                        label="Current Password"
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        {...registerPassword("currentPassword", {
                            required: "Current password is required",
                        })}
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff sx={{ color: colors.greenAccent[500] }} /> : <Visibility sx={{ color: colors.greenAccent[500] }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        margin="normal"
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword("newPassword", {
                            required: "New password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        })}
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff sx={{ color: colors.greenAccent[500] }} /> : <Visibility sx={{ color: colors.greenAccent[500] }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        margin="normal"
                        type={showConfirmPassword ? "text" : "password"}
                        {...registerPassword("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === watchPassword("newPassword") || "Passwords don't match",
                        })}
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff sx={{ color: colors.greenAccent[500] }} /> : <Visibility sx={{ color: colors.greenAccent[500] }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={
                                { background: colors.greenAccent[500] }
                            }
                        >
                            {loading ? <CircularProgress size={24} /> : "Change Password"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Account Actions Section */}
            {/* <Box component="section">
                <Typography variant="h5" gutterBottom>
                    Account Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" color="error">
                        Request Account Deletion
                    </Button>
                    <Button variant="outlined" color="warning">
                        Temporarily Deactivate Account
                    </Button>
                </Box>
            </Box> */}
        </Box>
    );
};

export default SettingsPage;