import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Alert,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import { LinkedIn, GitHub, EditOutlined, LocationOn, Email, School } from "@mui/icons-material";
import api from "../../api/api";
import { useAuth } from "../../auth/authContext";
import { tokens } from "../../theme";

const SettingsUserProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/manage/admin/user/${user.id}/profile`);
        setForm({
          first_name: res.data.first_name || "",
          second_name: res.data.second_name || "",
          email: res.data.email || "",
          location: res.data.profile?.location || "",
          linkedin_url: res.data.profile?.linkedin_url || "",
          github_url: res.data.profile?.github_url || "",
          bio_data: res.data.profile?.bio_data || "",
          about: res.data.profile?.about || "",
          year_of_joining: res.data.profile?.year_of_completion || "",
          year_of_completion: res.data.profile?.year_of_completion || "",
          institution_name: res.data.profile?.InstitutionName || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/manage/admin/user/${user.id}/profile`, {
        first_name: form.first_name,
        second_name: form.second_name,
        email: form.email,
        profile: {
          location: form.location,
          linkedin_url: form.linkedin_url,
          github_url: form.github_url,
          bio_data: form.bio_data,
          about: form.about,
          year_of_joining: form.year_of_joining,
          year_of_completion: form.year_of_completion,
          InstitutionName: form.institution_name,
        },
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
    setSaving(false);
  };

  // Style for links that works in both light and dark modes
  const linkStyle = {
    color: theme.palette.mode === 'dark' ? colors.blueAccent[300] : colors.blueAccent[700],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    }
  };

  if (loading || !form) return <LinearProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 1128, mx: "auto", p: 2 }}>
      {/* Cover Photo */}
      <Box
        sx={{
          height: 200,
          backgroundColor: colors.primary[500],
          borderRadius: "8px 8px 0 0",
          position: "relative",
          mb: 12,
        }}
      >
        {/* Profile Photo */}
        <Avatar
          sx={{
            width: 152,
            height: 152,
            fontSize: "3.5rem",
            bgcolor: colors.greenAccent[500],
            position: "absolute",
            bottom: -76,
            left: 24,
            border: "4px solid",
            borderColor: colors.primary[700],
          }}
        >
          {form.first_name?.charAt(0)}
          {form.second_name?.charAt(0)}
        </Avatar>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Basic Information"
              sx={{
                borderBottom: `1px solid ${colors.primary[400]}`,
                bgcolor: colors.primary[700],
              }}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EditOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Second Name"
                      name="second_name"
                      value={form.second_name}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EditOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Headline"
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      fullWidth
                      placeholder="E.g. Software Engineer at Tech Company"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EditOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Bio"
                      name="bio_data"
                      value={form.bio_data}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                      placeholder="Tell us about yourself..."
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EditOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Education"
              sx={{
                borderBottom: `1px solid ${colors.primary[400]}`,
                bgcolor: colors.primary[700],
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Institution Name"
                    name="institution_name"
                    value={form.institution_name}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <EditOutlined color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Year of Joining"
                    name="year_of_joining"
                    value={form.year_of_joining}
                    onChange={handleChange}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Year of Completion"
                    name="year_of_completion"
                    value={form.year_of_completion}
                    onChange={handleChange}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Contact Information"
              sx={{
                borderBottom: `1px solid ${colors.primary[400]}`,
                bgcolor: colors.primary[700],
              }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="LinkedIn URL"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedIn color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="GitHub URL"
                  name="github_url"
                  value={form.github_url}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHub color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={saving}
                sx={{
                  bgcolor: colors.greenAccent[600],
                  "&:hover": { bgcolor: colors.greenAccent[700] },
                  py: 1.5,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsUserProfile;