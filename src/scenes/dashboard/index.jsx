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
    <div className="m-2 sm:m-5">
      {/* Header Section (unchanged) */}
     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Header
          title="GRADUATE RECRUITMENT DASHBOARD"
          subtitle="Tracking Employer Selection Process & Candidate Skills"
        />
        <div className="flex gap-2">
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
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
        </div>
      </div>

      {/* Grid Layout - FIXED SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 mt-5 auto-rows-[minmax(140px,auto)]">
        {/* StatBoxes as direct grid children */}
        <div
          className="md:col-span-3 bg-opacity-80 p-4 rounded"
          style={{ background: colors.primary[400] }}
        >
          <StatBox
            title={mockData.totalJobSeekers.toLocaleString()}
            subtitle="Registered Graduates"
            progress={0.75}
            increase="+12%"
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </div>

        <div
          className="md:col-span-3 bg-opacity-80 p-4 rounded"
          style={{ background: colors.primary[400] }}
        >
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
        </div>

        <div
          className="md:col-span-3 bg-opacity-80 p-4 rounded"
          style={{ background: colors.primary[400] }}
        >
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
        </div>

        <div
          className="md:col-span-3 bg-opacity-80 p-4 rounded"
          style={{ background: colors.primary[400] }}
        >
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
        </div>

        {/* Hiring Process Visualizations */}
        <div
          className="md:col-span-8 md:row-span-2 bg-opacity-80 p-5 rounded flex flex-col"
          style={{ background: colors.primary[400] }}
        >
          <Typography variant="h5" fontWeight="600" className="mb-4">
            Recruitment Funnel Analysis
          </Typography>
          <div className="flex flex-wrap justify-center gap-6 flex-1 items-center">
            <ProgressCircle
              size={120}
              progress={mockData.hiringFunnel.shortlisted / mockData.totalJobSeekers}
              label="Shortlisted"
              value={mockData.hiringFunnel.shortlisted}
            />
            <ProgressCircle
              size={120}
              progress={mockData.hiringFunnel.interviewed / mockData.totalJobSeekers}
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
              progress={mockData.hiringFunnel.rejected / mockData.totalJobSeekers}
              label="Rejected"
              value={mockData.hiringFunnel.rejected}
            />
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className="md:col-span-4 md:row-span-2 bg-opacity-80 p-5 rounded flex flex-col"
          style={{ background: colors.primary[400] }}
        >
          <Typography variant="h5" fontWeight="600" className="mb-4">
            Recent Selection Activities
          </Typography>
          <div className="flex-1 overflow-auto">
            {mockData.recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex justify-between p-2 border-b"
                style={{ borderColor: colors.primary[500] }}
              >
                <div>
                  <Typography
                    style={{
                      color: colors.greenAccent[500],
                      fontWeight: 600,
                    }}
                  >
                    {activity.company}
                  </Typography>
                  <Typography variant="body2">
                    {activity.action} {activity.candidate}
                  </Typography>
                </div>
                <Typography variant="body2">{activity.date}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Top Graduate Certifications */}
        <div
          className="md:col-span-8 bg-opacity-80 p-5 rounded"
          style={{ background: colors.primary[400] }}
        >
          <Typography variant="h5" fontWeight="600" className="mb-4">
            Top Graduate Certifications
          </Typography>
          <div className="flex-1 min-h-[300px] w-full overflow-hidden touch-pan-y">
   <BarChart
              data={mockData.topCertifications.map((cert) => ({
                certification: cert.certification,
                holders: cert.count,
              }))}
              keys={["holders"]}
              indexBy="certification"
              isInteractive={true}
            />
</div>
         
        </div>

        {/* System Alerts */}
        <div
          className="md:col-span-4 bg-opacity-80 p-5 rounded flex flex-col"
          style={{ background: colors.primary[400] }}
        >
          <Typography variant="h5" fontWeight="600" className="mb-4">
            System Alerts
          </Typography>
          <div className="flex flex-col gap-3 flex-1">
            <div
              className="p-4 rounded flex-1"
              style={{ background: colors.redAccent[700] }}
            >
              <Typography fontWeight="600">
                {mockData.alerts.pendingVerifications} Pending Verifications
              </Typography>
            </div>
            <div
              className="p-4 rounded flex-1"
              style={{ background: colors.yellowAccent[700] }}
            >
              <Typography fontWeight="600">
                {mockData.alerts.incompleteProfiles} Incomplete Profiles
              </Typography>
            </div>
            <div
              className="p-4 rounded flex-1"
              style={{ background: colors.redAccent[700] }}
            >
              <Typography fontWeight="600">
                {mockData.alerts.suspendedAccounts} Suspended Accounts
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
