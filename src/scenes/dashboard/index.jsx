import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import ProgressCircle from "../../components/ProgressCircle";
import StatBox from "../../components/StatBox";
import { generateMockData, exportToCSV, exportToPDF } from "./dashboardUtils";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mockData = generateMockData();

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
          title="GRADUATE RECRUITMENT DASHBOARD"
          subtitle="Tracking Employer Selection Process & Candidate Skills"
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
            Export CSV
          </Button>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
            }}
            onClick={() => handleExport("pdf")}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Export PDF
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
            title={mockData.totalJobSeekers.toLocaleString()}
            subtitle="Registered Graduates"
            progress={0.75}
            ye
            increase="+12%"
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={mockData.activeEmployers.toLocaleString()}
            subtitle="Active Employers"
            progress={0.68}
            increase="+8%"
            icon={
              <BusinessIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} p="15px">
          <StatBox
            title={mockData.totalInterviews.toLocaleString()}
            subtitle="Total Interviews"
            progress={0.92}
            increase="+22%"
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
            increase="+3%"
            icon={
              <ChecklistIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Row 2 - Hiring Process Visualizations */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Recruitment Funnel Analysis
          </Typography>
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            height="80%"
          >
            <ProgressCircle
              size={120}
              progress={
                mockData.hiringFunnel.shortlisted / mockData.totalJobSeekers
              }
              label="Shortlisted"
              value={mockData.hiringFunnel.shortlisted}
            />
            <ProgressCircle
              size={120}
              progress={
                mockData.hiringFunnel.interviewed / mockData.totalJobSeekers
              }
              label="Interviewed"
              value={mockData.hiringFunnel.interviewed}
            />
            <ProgressCircle
              size={120}
              progress={mockData.hiringFunnel.hired / mockData.totalJobSeekers}
              label="Hired"
              value={mockData.hiringFunnel.hired}
            />
            <ProgressCircle
              size={120}
              progress={
                mockData.hiringFunnel.rejected / mockData.totalJobSeekers
              }
              label="Rejected"
              value={mockData.hiringFunnel.rejected}
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
            Recent Selection Activities
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
                <Typography variant="body2">
                  {activity.action} {activity.candidate}
                </Typography>
              </Box>
              <Typography variant="body2">{activity.date}</Typography>
            </Box>
          ))}
        </Box>

        {/* Row 3 - Skills & Certifications */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Top Graduate Certifications
          </Typography>
          <Box height="300px">
            <BarChart
              data={mockData.topCertifications.map((cert) => ({
                certification: cert.certification,
                holders: cert.count,
              }))}
              keys={["holders"]}
              indexBy="certification"
              isInteractive={true}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            System Alerts
          </Typography>
          <Box
            p="15px"
            bgcolor={colors.redAccent[700]}
            mb="10px"
            borderRadius="4px"
          >
            <Typography fontWeight="600">
              {mockData.alerts.pendingVerifications} Pending Verifications
            </Typography>
          </Box>
          <Box
            p="15px"
            bgcolor={colors.yellowAccent[700]}
            mb="10px"
            borderRadius="4px"
          >
            <Typography fontWeight="600">
              {mockData.alerts.incompleteProfiles} Incomplete Profiles
            </Typography>
          </Box>
          <Box p="15px" bgcolor={colors.redAccent[700]} borderRadius="4px">
            <Typography fontWeight="600">
              {mockData.alerts.suspendedAccounts} Suspended Accounts
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
