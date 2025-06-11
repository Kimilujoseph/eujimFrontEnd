import {
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Alert,
  useTheme,
  Snackbar,
  LinearProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";

export const CompanyRegistration = ({ onComplete }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactInfo: '',
    companyEmail: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/recruiter/register', {
        ...formData,
        userId: user.id
      });

      setSnackbar({
        open: true,
        message: 'Company registered successfully!',
        severity: 'success'
      });

      if (onComplete) {
        onComplete();
      } else {
        navigate('/employer/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const backendErrors = err.response.data?.errors || {};
        const formattedErrors = {};

        for (const [key, value] of Object.entries(backendErrors)) {
          formattedErrors[key] = Array.isArray(value) ? value.join(', ') : value;
        }

        setErrors(formattedErrors);
      } else {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Registration failed',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      maxWidth: '800px',
      margin: '0 auto',
      p: 3,
      backgroundColor: colors.primary[400],
      borderRadius: '4px'
    }}>
      <Stepper activeStep={0} orientation="vertical">
        <Step>
          <StepLabel sx={{ color: colors.grey[100] }}>
            Company Information
          </StepLabel>
          <StepContent>
            <form onSubmit={handleSubmit}>
              {errors.non_field_errors && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.non_field_errors}
                </Alert>
              )}

              <TextField
                fullWidth
                variant="filled"
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                sx={{
                  mb: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: colors.primary[500],
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                  },
                  '& .MuiFilledInput-input': {
                    color: colors.grey[100],
                  },
                  '& .MuiFormHelperText-root': {
                    color: colors.redAccent[400],
                  }
                }}
                required
              />

              <TextField
                fullWidth
                variant="filled"
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                error={!!errors.industry}
                helperText={errors.industry}
                sx={{
                  mb: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: colors.primary[500],
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                  },
                  '& .MuiFilledInput-input': {
                    color: colors.grey[100],
                  }
                }}
                required
              />

              <TextField
                fullWidth
                variant="filled"
                label="Contact Information"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                error={!!errors.contactInfo}
                helperText={errors.contactInfo}
                sx={{
                  mb: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: colors.primary[500],
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                  },
                  '& .MuiFilledInput-input': {
                    color: colors.grey[100],
                  }
                }}
                required
              />

              <TextField
                fullWidth
                variant="filled"
                label="Company Email"
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleChange}
                error={!!errors.companyEmail}
                helperText={errors.companyEmail}
                sx={{
                  mb: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: colors.primary[500],
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                  },
                  '& .MuiFilledInput-input': {
                    color: colors.grey[100],
                  }
                }}
                required
              />

              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                sx={{
                  mb: 3,
                  '& .MuiFilledInput-root': {
                    backgroundColor: colors.primary[500],
                  },
                  '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                  },
                  '& .MuiFilledInput-input': {
                    color: colors.grey[100],
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[900],
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700],
                    },
                    '&:disabled': {
                      backgroundColor: colors.grey[700],
                      color: colors.grey[500]
                    }
                  }}
                >
                  {loading ? 'Registering...' : 'Register Company'}
                </Button>
              </Box>
            </form>
          </StepContent>
        </Step>
      </Stepper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};