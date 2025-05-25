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
} from "@mui/material";
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
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
  const [activeTab, setActiveTab] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <LinearProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return <Alert severity="info">User not found</Alert>;
  if (user.role !== "jobseeker")
    return (
      <Alert severity="error">
        This profile is only available for job seekers
      </Alert>
    );

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h2" fontWeight="bold">
          {user.first_name} {user.second_name}'s Profile
        </Typography>
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

      <Grid container spacing={3}>
        {/* Left Column - Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              mb: 3,
              bgcolor: colors.primary[700],
              border: `1px solid ${colors.primary[400]}`,
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: "2.5rem",
                    bgcolor: colors.greenAccent[500],
                    mb: 2,
                  }}
                >
                  {user.first_name?.charAt(0)}
                  {user.second_name?.charAt(0)}
                </Avatar>

                <Box display="flex" gap={1} my={2}>
                  <Chip
                    label={user.isVerified ? "Verified" : "Pending"}
                    color={user.isVerified ? "success" : "warning"}
                  />
                  {!user.isActive && <Chip label="Inactive" color="error" />}
                </Box>
              </Box>

              <Divider
                sx={{
                  my: 2,
                  borderColor: colors.primary[400],
                }}
              />

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon
                    sx={{ minWidth: "36px", color: colors.greenAccent[400] }}
                  >
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    primaryTypographyProps={{ color: colors.grey[100] }}
                    secondary={user.email}
                    secondaryTypographyProps={{ color: colors.grey[400] }}
                  />
                </ListItem>

                {user.profile?.location && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={user.profile.location}
                    />
                  </ListItem>
                )}

                {user.profile?.linkedin_url && (
                  <ListItem>
                    <ListItemIcon>
                      <LinkedInIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="LinkedIn"
                      secondary={
                        <Link href={user.profile.linkedin_url} target="_blank">
                          View Profile
                        </Link>
                      }
                    />
                  </ListItem>
                )}

                {user.profile?.github_url && (
                  <ListItem>
                    <ListItemIcon>
                      <GitHubIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="GitHub"
                      secondary={
                        <Link href={user.profile.github_url} target="_blank">
                          View Profile
                        </Link>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={8}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                color: colors.grey[400],
                "&.Mui-selected": {
                  color: colors.greenAccent[400],
                },
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Skills" />
            <Tab label="Education" />
            <Tab label="Certifications" />
            <Tab label="Interviews" />
          </Tabs>

          <Box
            sx={{
              minHeight: "500px",
              position: "relative",
            }}
          >
            {activeTab === 0 && (
              <Card sx={{ bgcolor: colors.primary[700] }}>
                <CardContent>
                  {user.profile?.bio_data && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Professional Summary
                      </Typography>
                      <Typography paragraph sx={{ color: colors.grey[400] }}>
                        {user.profile.bio_data}
                      </Typography>
                      <Divider
                        sx={{ my: 2, borderColor: colors.primary[400] }}
                      />
                    </>
                  )}

                  {user.profile?.about && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        About
                      </Typography>
                      <Typography paragraph>{user.profile.about}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 1 && (
              <Card sx={{ bgcolor: colors.primary[700] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skills & Proficiencies
                  </Typography>
                  <Grid container spacing={2}>
                    {mockSkills.map((skill) => (
                      <Grid item xs={12} sm={6} md={4} key={skill.id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography fontWeight="bold">
                            {skill.name}
                          </Typography>
                          <Chip
                            label={skill.proficiency_level}
                            color={
                              skill.proficiency_level === "professional"
                                ? "success"
                                : skill.proficiency_level === "midlevel"
                                ? "warning"
                                : "info"
                            }
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {activeTab === 2 && (
              <Card sx={{ bgcolor: colors.primary[700] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Education
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="University Education"
                        secondary={
                          <>
                            <Typography component="span" display="block">
                              {user.profile.year_of_joining} -{" "}
                              {user.profile.year_of_completion}
                            </Typography>
                            <Typography component="span" display="block">
                              {user.profile.InstitutionName || "University"}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}

            {activeTab === 3 && (
              <Card sx={{ bgcolor: colors.primary[700] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Certifications
                  </Typography>
                  <Grid container spacing={2}>
                    {mockCertifications.map((cert) => (
                      <Grid item xs={12} sm={6} md={4} key={cert.id}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <PdfIcon
                              sx={{ mr: 1, color: colors.redAccent[500] }}
                            />
                            <Typography variant="subtitle1">
                              {cert.issuer}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Awarded:{" "}
                            {new Date(cert.awardedDate).toLocaleDateString()}
                          </Typography>
                          {cert.uploadPath && (
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                              onClick={() =>
                                window.open(cert.uploadPath, "_blank")
                              }
                            >
                              View Certificate
                            </Button>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {activeTab === 4 && (
              <Card sx={{ bgcolor: colors.primary[700] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Interview History
                  </Typography>
                  <List>
                    {mockInterviews.map((interview) => (
                      <div key={interview.id}>
                        <ListItem>
                          <ListItemIcon>
                            <WorkIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${interview.position} at ${interview.company}`}
                            secondary={
                              <>
                                <Typography component="span" display="block">
                                  Date:{" "}
                                  {new Date(
                                    interview.date
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography component="span" display="block">
                                  Status: {interview.status} • Result:{" "}
                                  {interview.result}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobSeekerProfile;
