import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "./authContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const Logout = () => {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError("Logout failed. Please try again.");
      setSnackbarOpen(true); // Show snackbar on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
          {/* Display error in dialog if needed */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              onClick={handleLogout}
              color="error"
              variant="contained"
              disabled={loading}
            >
              Logout
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: "error.main",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      
      {/* Fixed Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Logout;