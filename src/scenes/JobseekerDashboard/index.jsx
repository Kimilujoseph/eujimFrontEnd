import {
  Box,
  Button,
  Typography,
  useTheme,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import DoughnutChart from "../../components/DoughnutChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const JobSeekerDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authState } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/graduate/profile/analytics`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setAnalyticsData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [authState.token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return colors.redAccent[500];
      case "intermediate":
        return colors.blueAccent[500];
      case "midlevel":
        return colors.greenAccent[500];
      case "professional":
        return colors.greenAccent[700];
      default:
        return colors.grey[500];
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography>No analytics data available</Typography>
      </Box>
    );
  }

  const {
    profile_completion,
    recruiter_engagement,
    application_status_stats,
    education_distribution,
    skill_distribution,
    skills_growth_timeline,
  } = analyticsData;

  return (
    <Box
      className={`p-5 ${
        theme.palette.mode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header Section */}
      <Box className="flex justify-between items-center mb-6">
        <Header
          title="JOB SEEKER ANALYTICS DASHBOARD"
          subtitle="Comprehensive Overview of Your Job Search Progress"
        />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
          }}
          startIcon={<DownloadOutlinedIcon />}
        >
          Export Report
        </Button>
      </Box>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Profile Completion */}
        <div
          className={`md:col-span-3 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Profile Completion
          </Typography>
          <div className="flex flex-col items-center">
            <CircularProgress
              variant="determinate"
              value={profile_completion}
              size={100}
              thickness={5}
              sx={{
                "& .MuiCircularProgress-circle": {
                  stroke: colors.greenAccent[500],
                },
              }}
            />
            <Typography variant="h4" className="mt-3 font-bold">
              {profile_completion}%
            </Typography>
            <Typography variant="body2" className="mt-1">
              Complete your profile for better visibility
            </Typography>
          </div>
        </div>

        {/* Recruiter Engagement */}
        <div
          className={`md:col-span-3 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Recruiter Engagement
          </Typography>
          <div className="flex items-center mb-4">
            <PeopleAltIcon
              className="mr-2"
              sx={{ color: colors.greenAccent[500] }}
            />
            <Typography variant="h4" className="font-bold">
              {recruiter_engagement.recruiter_count}
            </Typography>
          </div>
          <Typography variant="body2" className="mb-3">
            Recruiters viewed your profile
          </Typography>
        </div>

        {/* Application Status */}
        <div
          className={`md:col-span-6 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Application Status
          </Typography>
          <div className="h-64">
            <BarChart
              data={[
                { status: "Hired", count: application_status_stats.hired },
                {
                  status: "Interviewed",
                  count: application_status_stats.interviewed,
                },
                {
                  status: "Shortlisted",
                  count: application_status_stats.shortlisted,
                },
                {
                  status: "Rejected",
                  count: application_status_stats.rejected,
                },
              ]}
              keys={["count"]}
              indexBy="status"
              colors={[
                colors.greenAccent[500],
                colors.blueAccent[500],
                colors.yellowAccent[500],
                colors.redAccent[500],
              ]}
            />
          </div>
        </div>

        {/* Recent Interactions */}
        <div
          className={`md:col-span-6 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Recent Interactions
          </Typography>
          <div className="space-y-2">
            {recruiter_engagement.recent_interactions.map(
              (interaction, index) => (
                <div key={index} className="interaction-item">
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {interaction.company}
                    </Typography>
                    <Typography variant="body2">
                      {interaction.status} • {formatDate(interaction.date)}
                    </Typography>
                  </div>
                  <Chip
                    label={interaction.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        interaction.status === "interviewed"
                          ? colors.greenAccent[500]
                          : interaction.status === "shortlisted"
                          ? colors.blueAccent[500]
                          : colors.grey[500],
                      color: colors.grey[100],
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Skill Distribution */}
        <div
          className={`md:col-span-3 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Skill Distribution
          </Typography>
          <div className="h-64">
            <DoughnutChart
              data={[
                { id: "Beginner", value: skill_distribution.begginner },
                { id: "Intermediate", value: skill_distribution.intermediate },
                { id: "Mid Level", value: skill_distribution.midlevel },
                { id: "Professional", value: skill_distribution.proffessional },
              ]}
              colors={[
                colors.redAccent[500],
                colors.blueAccent[500],
                colors.greenAccent[500],
                colors.greenAccent[700],
              ]}
            />
          </div>
        </div>

        {/* Education Distribution */}
        <div
          className={`md:col-span-3 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Education
          </Typography>
          <div className="space-y-3">
            {education_distribution.map((edu, index) => (
              <div key={index} className="flex items-center">
                <SchoolIcon
                  className="mr-2"
                  sx={{ color: colors.blueAccent[500] }}
                />
                <div>
                  <Typography
                    variant="body1"
                    className="capitalize font-medium"
                  >
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2">
                    {edu.count} {edu.count > 1 ? "certificates" : "certificate"}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Timeline */}
        <div
          className={`md:col-span-6 jobseeker-card ${
            theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Typography variant="h6" className="mb-3 font-semibold">
            Skills Growth Timeline
          </Typography>
          <Timeline position="alternate" className="max-h-96 overflow-y-auto">
            {skills_growth_timeline.map((skill, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor: getSkillLevelColor(
                        skill.proficiency_level
                      ),
                    }}
                  />
                  {index < skills_growth_timeline.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <div className="p-2">
                    <Typography variant="body1" className="font-medium">
                      {skill.skill_name}
                    </Typography>
                    <Typography variant="body2">
                      {skill.proficiency_level} • {formatDate(skill.date_added)}
                    </Typography>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </Box>
  );
};

export default JobSeekerDashboard;
