import { useState, useEffect } from 'react';
import {
  People as CandidatesIcon,
  Work as HiredIcon,
  CalendarToday as InterviewedIcon,
  HowToReg as ShortlistedIcon,
  Block as RejectedIcon,
  AccessTime as ResponseTimeIcon,
  Description as DocumentsIcon,
  TrendingUp as ActivityIcon,
  Code as SkillsIcon,
  Update as RecentActivityIcon,
} from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  useTheme,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/api';

const RecruiterDashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/recruiter/profile/dashboard/');
        setDashboardData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h6">Failed to load dashboard data</Typography>
      </Box>
    );
  }

  const {
    recruitment_overview,
    performance_metrics,
    document_status,
    recent_activities,
    skill_insights,
  } = dashboardData;

  const weeklyActivityData = performance_metrics.weekly_activity.map((item) => ({
    day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
    actions: item.actions,
  }));

  const statusColors = {
    hired: 'success.main',
    interviewed: 'warning.main',
    shortlisted: 'info.main',
    rejected: 'error.main',
  };

  const statusBgColors = {
    hired: 'success.light',
    interviewed: 'warning.light',
    shortlisted: 'info.light',
    rejected: 'error.light',
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Recruiter Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={2} mb={3}>
        {/* Total Candidates */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Candidates
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {recruitment_overview.total_candidates}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.light' }}>
                <CandidatesIcon color="primary" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Hired */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Hired
                </Typography>
                <Typography variant="h4" fontWeight={600} color={statusColors.hired}>
                  {recruitment_overview.hired}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: statusBgColors.hired }}>
                <HiredIcon color="success" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Interviewed */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Interviewed
                </Typography>
                <Typography variant="h4" fontWeight={600} color={statusColors.interviewed}>
                  {recruitment_overview.interviewed}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: statusBgColors.interviewed }}>
                <InterviewedIcon color="warning" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Shortlisted */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Shortlisted
                </Typography>
                <Typography variant="h4" fontWeight={600} color={statusColors.shortlisted}>
                  {recruitment_overview.shortlisted}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: statusBgColors.shortlisted }}>
                <ShortlistedIcon color="info" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Rejected */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Rejected
                </Typography>
                <Typography variant="h4" fontWeight={600} color={statusColors.rejected}>
                  {recruitment_overview.rejected}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: statusBgColors.rejected }}>
                <RejectedIcon color="error" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - 2/3 width */}
        <Grid item xs={12} md={8}>
          {/* Weekly Activity Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Weekly Activity
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actions" fill="#4ade80" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Recent Activities */}
          <Paper sx={{ overflow: 'hidden' }}>
            <Box p={2} display="flex" alignItems="center" borderBottom="1px solid" borderColor="divider">
              <RecentActivityIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Recent Activities
              </Typography>
            </Box>
            <Box>
              {recent_activities.map((activity, index) => (
                <Box
                  key={index}
                  p={2}
                  borderBottom={index < recent_activities.length - 1 ? '1px solid' : 'none'}
                  borderColor="divider"
                >
                  <Box display="flex" alignItems="flex-start">
                    <Avatar sx={{ bgcolor: statusColors[activity.status] }}>
                      {activity.job_seeker__user__firstName?.charAt(0)}
                      {activity.job_seeker__user__lastName?.charAt(0)}
                    </Avatar>
                    <Box ml={2}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {activity.job_seeker__user__firstName} {activity.job_seeker__user__lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(activity.updatedAt).toLocaleString()}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 4,
                            bgcolor: statusColors[activity.status],
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        >
                          {activity.status}
                        </Box>
                        {activity.notes && (
                          <Typography variant="caption" color="text.secondary" ml={1}>
                            {activity.notes}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - 1/3 width */}
        <Grid item xs={12} md={4}>
          {/* Performance Metrics */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Performance Metrics
            </Typography>
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Avg. Response Time
                </Typography>
                <Box display="flex" alignItems="center">
                  <ResponseTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {Math.round(parseFloat(performance_metrics.avg_time_to_respond) / 3600)} hours
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, parseFloat(performance_metrics.avg_time_to_respond) / 100)}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                Interviewed
              </Typography>
              <Typography variant="body2">
                {performance_metrics.interviewed_count}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Shortlisted
              </Typography>
              <Typography variant="body2">
                {performance_metrics.shortlisted_count}
              </Typography>
            </Box>
          </Paper>

          {/* Document Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <DocumentsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Document Status
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                Total Documents
              </Typography>
              <Typography variant="body2">
                {document_status.total_documents}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
              <Typography variant="body2">
                {document_status.pending}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
              <Typography variant="body2">
                {document_status.approved}
              </Typography>
            </Box>
            {document_status.latest_document && (
              <Typography variant="caption" color="text.secondary">
                Latest: {document_status.latest_document}
              </Typography>
            )}
          </Paper>

          {/* Skill Insights */}
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <SkillsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Skill Insights
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Skill</TableCell>
                    <TableCell align="right">Candidates</TableCell>
                    <TableCell align="right">Avg. Proficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skill_insights.map((skill, index) => (
                    <TableRow key={index}>
                      <TableCell>{skill.skill}</TableCell>
                      <TableCell align="right">{skill.count}</TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <Box width="60%" mr={1}>
                            <LinearProgress
                              variant="determinate"
                              value={(skill.avg_proficiency / 3) * 100}
                              color="success"
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {skill.avg_proficiency.toFixed(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruiterDashboard;