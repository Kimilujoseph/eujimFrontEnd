import {
  Box,
  Button,
  Typography,
  useTheme,
  Chip,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import ProgressCircle from "../../components/ProgressCircle";
import StatBox from "../../components/StatBox";
import {
  generateMockJobSeekerData,
  exportToCSV,
  exportToPDF,
} from "./jobSeekerDashboardUtils";

const JobSeekerDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mockData = generateMockJobSeekerData();

  const handleExport = (type) => {
    switch (type) {
      case "csv":
        exportToCSV(mockData);
        break;
      case "pdf":
        exportToPDF(mockData);
        break;
      default:
        console.log("Exporting data...", mockData);
    }
  };

  return (
    <Box m="20px">
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="JOB SEEKER DASHBOARD"
          subtitle="Track Your Profile, Skills, and Job Search Progress"
        />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              mr: 2,
            }}
            onClick={() => handleExport("csv")}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Export Data
          </Button>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
            }}
            onClick={() => window.print()}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Print Profile
          </Button>
        </Box>
      </Box>

      {/* Grid Layout */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Row 1 - Key Metrics */}
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={mockData.applicationsSent}
            subtitle="Applications Sent"
            progress={mockData.applicationsSent / 20} // Assuming 20 is a target
            increase={`+${mockData.applicationsIncrease}%`}
            icon={
              <WorkIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={mockData.interviewsScheduled}
            subtitle="Interviews Scheduled"
            progress={mockData.interviewsScheduled / 10} // Assuming 10 is a target
            increase={`+${mockData.interviewsIncrease}%`}
            icon={
              <AssignmentTurnedInIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={`${mockData.profileCompleteness}%`}
            subtitle="Profile Completeness"
            progress={mockData.profileCompleteness / 100}
            increase="+5%"
            icon={
              <ChecklistIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={mockData.profileViews}
            subtitle="Profile Views"
            progress={mockData.profileViews / 50} // Assuming 50 is a good number
            increase={`+${mockData.profileViewsIncrease}%`}
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Row 2 - Profile Overview */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Application Status Breakdown
          </Typography>
          <Box height="300px">
            <BarChart
              data={[
                { status: "Applied", count: mockData.applicationsSent },
                { status: "Viewed", count: mockData.applicationsViewed },
                { status: "Interview", count: mockData.interviewsScheduled },
                { status: "Rejected", count: mockData.applicationsRejected },
                { status: "Offered", count: mockData.offersReceived },
              ]}
              keys={["count"]}
              indexBy="status"
              colors={[colors.greenAccent[500]]}
              isInteractive={true}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
          overflow="auto"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Recent Activities
          </Typography>
          {mockData.recentActivities.map((activity, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              p="10px"
              borderBottom={`1px solid ${colors.primary[500]}`}
            >
              <Box>
                <Typography color={colors.greenAccent[500]} fontWeight="600">
                  {activity.company}
                </Typography>
                <Typography variant="body2">{activity.action}</Typography>
              </Box>
              <Typography variant="body2">{activity.date}</Typography>
            </Box>
          ))}
        </Box>

        {/* Row 3 - Skills & Education */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Your Skills
          </Typography>
          <Box>
            {mockData.skills.map((skill, i) => (
              <Box key={i} mb="10px">
                <Box display="flex" justifyContent="space-between" mb="5px">
                  <Typography variant="body1">{skill.name}</Typography>
                  <Typography variant="body2">{skill.level}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.progress}
                  sx={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: colors.primary[500],
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Your Certifications
          </Typography>
          {mockData.certifications.map((cert, i) => (
            <Box
              key={i}
              mb="15px"
              p="10px"
              borderRadius="4px"
              bgcolor={colors.primary[500]}
            >
              <Typography fontWeight="600">{cert.name}</Typography>
              <Typography variant="body2" mb="5px">
                {cert.issuer}
              </Typography>
              <Typography variant="body2" color={colors.greenAccent[500]}>
                Awarded: {cert.date}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Education Summary
          </Typography>
          {mockData.education.map((edu, i) => (
            <Box
              key={i}
              mb="15px"
              p="10px"
              borderRadius="4px"
              bgcolor={colors.primary[500]}
            >
              <Typography fontWeight="600">{edu.degree}</Typography>
              <Typography variant="body2">{edu.institution}</Typography>
              <Typography variant="body2" color={colors.greenAccent[500]}>
                {edu.startYear} - {edu.endYear || "Present"}
              </Typography>
              <Typography variant="body2">{edu.fieldOfStudy}</Typography>
            </Box>
          ))}
        </Box>

        {/* Row 4 - Recommendations */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Recommended Jobs For You
          </Typography>
          <Box display="flex" flexWrap="wrap" gap="15px">
            {mockData.recommendedJobs.map((job, i) => (
              <Box
                key={i}
                width="30%"
                p="15px"
                borderRadius="4px"
                bgcolor={colors.primary[500]}
              >
                <Typography fontWeight="600">{job.title}</Typography>
                <Typography variant="body2" color={colors.greenAccent[500]}>
                  {job.company}
                </Typography>
                <Typography variant="body2" mb="10px">
                  {job.location}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap="5px" mb="10px">
                  {job.skills.map((skill, j) => (
                    <Chip
                      key={j}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                      }}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    "&:hover": { backgroundColor: colors.greenAccent[700] },
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JobSeekerDashboard;
