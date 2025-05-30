import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import api from "../../api/api";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Chip,
  Divider,
  Button,
  LinearProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  IconButton,
} from "@mui/material";
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

// Mock data for development
const mockSkills = [
  { id: 1, name: "JavaScript", proficiency_level: "professional" },
  { id: 2, name: "Node.js", proficiency_level: "professional" },
  { id: 3, name: "React", proficiency_level: "midlevel" },
  { id: 4, name: "MongoDB", proficiency_level: "intermediate" },
];

const mockCertifications = [
  {
    id: 1,
    issuer: "AWS",
    awardedDate: "2023-01-15",
    uploadPath: "/certificates/aws-cert.pdf",
    description: "AWS Certified Developer Associate",
  },
  {
    id: 2,
    issuer: "Google Cloud",
    awardedDate: "2022-11-01",
    uploadPath: "/certificates/gcp-cert.pdf",
    description: "Google Cloud Professional Architect",
  },
];

const mockInterviews = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Senior Backend Developer",
    date: "2023-06-15",
    status: "Completed",
    result: "Advanced to next round",
  },
  {
    id: 2,
    company: "StartUp Inc",
    position: "Node.js Developer",
    date: "2023-05-20",
    status: "Completed",
    result: "Offer extended",
  },
];

const JobSeekerProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/manage/admin/user/${id}/profile`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LinearProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return <Alert severity="info">User not found</Alert>;
  if (user.role !== "jobseeker")
    return (
      <Alert severity="error">
        This profile is only available for job seekers
      </Alert>
    );

  // Style for links that works in both light and dark modes
  const linkStyle = {
    color: theme.palette.mode === 'dark' ? colors.blueAccent[300] : colors.blueAccent[700],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    }
  };

  return (
    <Box sx={{ maxWidth: 1128, margin: "0 auto", p: 2 }}>
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
          {user.first_name?.charAt(0)}
          {user.second_name?.charAt(0)}
        </Avatar>
      </Box>

      {/* Profile Header */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user.first_name} {user.second_name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.profile?.headline || "Job Seeker"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {user.profile?.location && (
                <>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {user.profile.location}
                  </Typography>
                </>
              )}
              {user.profile?.linkedin_url && (
                <Link href={user.profile.linkedin_url} target="_blank" sx={linkStyle}>
                  <LinkedInIcon fontSize="small" sx={{ ml: 1 }} />
                </Link>
              )}
              {user.profile?.github_url && (
                <Link href={user.profile.github_url} target="_blank" sx={linkStyle}>
                  <GitHubIcon fontSize="small" sx={{ ml: 1 }} />
                </Link>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={user.isVerified ? "Verified" : "Pending"}
                color={user.isVerified ? "success" : "warning"}
                size="small"
              />
              {!user.isActive && <Chip label="Inactive" color="error" size="small" />}
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: colors.greenAccent[600],
                "&:hover": { bgcolor: colors.greenAccent[700] },
              }}
            >
              Back to Users
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* About Section */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="About" />
            <CardContent>
              <Typography variant="body1">
                {user.profile?.bio_data || "No bio information available"}
              </Typography>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Experience" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon sx={{ color: colors.blueAccent[500] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Senior Developer"
                    secondary={
                      <>
                        <Typography component="span" display="block">
                          Tech Company Inc.
                        </Typography>
                        <Typography component="span" display="block">
                          Jan 2020 - Present · 3 yrs 6 mos
                        </Typography>
                        <Typography component="span" display="block">
                          San Francisco, California
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Education" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon sx={{ color: colors.blueAccent[500] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.profile?.InstitutionName || "University"}
                    secondary={
                      <>
                        <Typography component="span" display="block">
                          Bachelor's Degree, Computer Science
                        </Typography>
                        <Typography component="span" display="block">
                          {user.profile?.year_of_joining} -{" "}
                          {user.profile?.year_of_completion}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Skills" />
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {mockSkills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Licenses & Certifications" />
            <CardContent>
              <List>
                {mockCertifications.map((cert) => (
                  <ListItem key={cert.id}>
                    <ListItemIcon>
                      <PdfIcon sx={{ color: colors.redAccent[500] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={cert.description}
                      secondary={
                        <>
                          <Typography component="span" display="block">
                            {cert.issuer} · Issued {new Date(cert.awardedDate).toLocaleDateString()}
                          </Typography>
                          <Link href={cert.uploadPath} target="_blank" sx={linkStyle}>
                            Show credential
                          </Link>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Profile Completion Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Profile completion
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mb: 1, height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary">
                75% complete
              </Typography>
            </CardContent>
          </Card>

          {/* Contact Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Contact Information" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={user.email}
                    primaryTypographyProps={{ sx: linkStyle }}
                  />
                </ListItem>
                {user.profile?.linkedin_url && (
                  <ListItem>
                    <ListItemIcon>
                      <LinkedInIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href={user.profile.linkedin_url} target="_blank" sx={linkStyle}>
                          LinkedIn Profile
                        </Link>
                      }
                    />
                  </ListItem>
                )}
                {user.profile?.github_url && (
                  <ListItem>
                    <ListItemIcon>
                      <GitHubIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href={user.profile.github_url} target="_blank" sx={linkStyle}>
                          GitHub Profile
                        </Link>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Interviews Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Interview History" />
            <CardContent>
              <List>
                {mockInterviews.map((interview) => (
                  <ListItem key={interview.id}>
                    <ListItemIcon>
                      <WorkIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${interview.position} at ${interview.company}`}
                      secondary={
                        <>
                          <Typography component="span" display="block">
                            {new Date(interview.date).toLocaleDateString()}
                          </Typography>
                          <Typography component="span" display="block">
                            Status: {interview.status}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobSeekerProfile;