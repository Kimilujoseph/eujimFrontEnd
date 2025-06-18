import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tokens } from "../theme";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !newPassword || !repeatPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Use the same API as login, but with a reset endpoint
      await api.post("/auth/forgot-password", {
        email,
        password: newPassword,
      });
      setSuccess("Password reset successful. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Email not found.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: colors.primary[500],
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: colors.primary[400],
        }}
      >
        <Box width="100%" mb={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/login")}
            sx={{
              color: colors.greenAccent[400],
              textTransform: "none",
              fontWeight: 500,
              mb: 1,
              pl: 0,
              "&:hover": { textDecoration: "underline" },
              minWidth: 0,
            }}
          >
            Back to Login
          </Button>
        </Box>
        <Avatar sx={{ m: 1, bgcolor: colors.greenAccent[500] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          mb={2}
          fontWeight={700}
          color={colors.grey[100]}
        >
          Reset Password
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: colors.greenAccent[400] }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: colors.grey[300] },
            }}
            sx={{
              input: { color: colors.grey[100] },
              mb: 2,
              background: colors.primary[400],
              borderRadius: 1,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    sx={{ color: colors.greenAccent[400] }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: colors.grey[300] },
            }}
            sx={{
              input: { color: colors.grey[100] },
              mb: 2,
              background: colors.primary[400],
              borderRadius: 1,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            label="Repeat Password"
            type={showRepeat ? "text" : "password"}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle repeat password visibility"
                    onClick={() => setShowRepeat((show) => !show)}
                    edge="end"
                    sx={{ color: colors.greenAccent[400] }}
                  >
                    {showRepeat ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: colors.grey[300] },
            }}
            sx={{
              input: { color: colors.grey[100] },
              mb: 2,
              background: colors.primary[400],
              borderRadius: 1,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              fontWeight: 700,
              background: colors.greenAccent[600],
              color: colors.grey[900],
              "&:hover": {
                background: colors.greenAccent[700],
              },
            }}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;