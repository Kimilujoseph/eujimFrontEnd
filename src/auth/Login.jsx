import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "./authContext";
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
import { tokens } from "../theme";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      if (res.data.user.role === "superAdmin") {
        navigate("/");
      } else if (res.data.user.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/job-seeker-dashboard/")
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please check your connection.");
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
        <Avatar sx={{ m: 1, bgcolor: colors.greenAccent[600] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          mb={2}
          fontWeight={700}
          color={colors.grey[100]}
        >
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
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
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mb={2}
          >
            <Button
              variant="text"
              size="small"
              sx={{
                color: colors.greenAccent[400],
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
                p: 0,
                minWidth: "unset",
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Button>
          </Box>
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
