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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { tokens } from "../theme";

const PasswordResetForm = ({ email: initialEmail = "", verificationCode }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const [email, setEmail] = useState(initialEmail);
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

    if (!newPassword || !repeatPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword,
        verificationCode
      });
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer title="Reset Password" icon={<LockOutlinedIcon />}>
      {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: "100%", mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        {!initialEmail && (
          <EmailInput
            email={email}
            setEmail={setEmail}
            colors={colors}
          />
        )}

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword((show) => !show)}
          colors={colors}
        />

        <PasswordInput
          label="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          showPassword={showRepeat}
          toggleShowPassword={() => setShowRepeat((show) => !show)}
          colors={colors}
        />

        <SubmitButton loading={loading} colors={colors}>
          {loading ? "Resetting..." : "Reset Password"}
        </SubmitButton>
      </Box>
    </AuthFormContainer>
  );
};

export default PasswordResetForm;