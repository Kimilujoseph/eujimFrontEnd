import { useState, useEffect, useContext } from 'react';
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
import { ColorModeContext, tokens } from '../../theme';
//import { useTheme } from '@mui/material';

const RecruiterDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

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

    // Status colors
    const statusColors = {
        hired: colors.greenAccent[500],
        interviewed: colors.yellowAccent[500],
        shortlisted: colors.blueAccent[500],
        rejected: colors.redAccent[500]
    };

    return (
        <div className="p-5 w-full max-w-full overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-6" style={{ color: colors.grey[100] }}>
                Recruiter Dashboard
            </h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 w-full">
                {/* Total Candidates */}
                <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium" style={{ color: colors.grey[300] }}>Total Candidates</h3>
                            <p className="text-3xl font-semibold" style={{ color: colors.grey[100] }}>
                                {recruitment_overview.total_candidates}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full`} style={{ backgroundColor: colors.blueAccent[900] }}>
                            <CandidatesIcon style={{ color: colors.blueAccent[500] }} />
                        </div>
                    </div>
                </div>

                {/* Hired */}
                <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium" style={{ color: colors.grey[300] }}>Hired</h3>
                            <p className="text-3xl font-semibold" style={{ color: colors.greenAccent[500] }}>
                                {recruitment_overview.hired}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full`} style={{ backgroundColor: colors.greenAccent[900] }}>
                            <HiredIcon style={{ color: colors.greenAccent[500] }} />
                        </div>
                    </div>
                </div>

                {/* Interviewed */}
                <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium" style={{ color: colors.grey[300] }}>Interviewed</h3>
                            <p className="text-3xl font-semibold" style={{ color: colors.yellowAccent[500] }}>
                                {recruitment_overview.interviewed}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full`} style={{ backgroundColor: colors.yellowAccent[900] }}>
                            <InterviewedIcon style={{ color: colors.yellowAccent[500] }} />
                        </div>
                    </div>
                </div>

                {/* Shortlisted */}
                <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium" style={{ color: colors.grey[300] }}>Shortlisted</h3>
                            <p className="text-3xl font-semibold" style={{ color: colors.blueAccent[500] }}>
                                {recruitment_overview.shortlisted}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full`} style={{ backgroundColor: colors.blueAccent[900] }}>
                            <ShortlistedIcon style={{ color: colors.blueAccent[500] }} />
                        </div>
                    </div>
                </div>

                {/* Rejected */}
                <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium" style={{ color: colors.grey[300] }}>Rejected</h3>
                            <p className="text-3xl font-semibold" style={{ color: colors.redAccent[500] }}>
                                {recruitment_overview.rejected}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full`} style={{ backgroundColor: colors.redAccent[900] }}>
                            <RejectedIcon style={{ color: colors.redAccent[500] }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="md:col-span-2 space-y-6">
                    {/* Weekly Activity Chart */}
                    <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.grey[100] }}>
                            Weekly Activity
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                                    <XAxis
                                        dataKey="day"
                                        style={{ fill: colors.grey[300], fontSize: '0.75rem' }}
                                    />
                                    <YAxis style={{ fill: colors.grey[300], fontSize: '0.75rem' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: colors.primary[500],
                                            borderColor: colors.grey[700],
                                            borderRadius: '0.5rem',
                                            color: colors.grey[100]
                                        }}
                                        itemStyle={{
                                            color: colors.grey[100]
                                        }}
                                        labelStyle={{
                                            color: colors.grey[100],
                                            fontWeight: '600'
                                        }}
                                    />
                                    <Bar
                                        dataKey="actions"
                                        fill={colors.greenAccent[500]}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="p-4 flex items-center border-b" style={{ borderColor: colors.grey[700] }}>
                            <RecentActivityIcon style={{ color: colors.grey[300], marginRight: '0.5rem' }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.grey[100] }}>
                                Recent Activities
                            </h3>
                        </div>
                        <div className="divide-y" style={{ borderColor: colors.grey[700] }}>
                            {recent_activities.map((activity, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex items-start">
                                        <div 
                                            className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: statusColors[activity.status] }}
                                        >
                                            {activity.job_seeker__user__firstName?.charAt(0)}
                                            {activity.job_seeker__user__lastName?.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium" style={{ color: colors.grey[100] }}>
                                                {activity.job_seeker__user__firstName} {activity.job_seeker__user__lastName}
                                            </h4>
                                            <p className="text-xs mt-1" style={{ color: colors.grey[400] }}>
                                                {new Date(activity.updatedAt).toLocaleString()}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <span 
                                                    className="px-2 py-1 text-xs rounded-full text-white"
                                                    style={{ backgroundColor: statusColors[activity.status] }}
                                                >
                                                    {activity.status}
                                                </span>
                                                {activity.notes && (
                                                    <p className="text-xs ml-2" style={{ color: colors.grey[400] }}>
                                                        {activity.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    {/* Performance Metrics */}
                    <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.grey[100] }}>
                            Performance Metrics
                        </h3>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm" style={{ color: colors.grey[300] }}>Avg. Response Time</span>
                                <div className="flex items-center">
                                    <ResponseTimeIcon className="text-sm mr-1" style={{ color: colors.grey[300] }} />
                                    <span className="text-sm" style={{ color: colors.grey[100] }}>
                                        {Math.round(parseFloat(performance_metrics.avg_time_to_respond) / 3600)} hours
                                    </span>
                                </div>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.grey[700] }}>
                                <div
                                    className="h-2 rounded-full"
                                    style={{ 
                                        width: `${Math.min(100, parseFloat(performance_metrics.avg_time_to_respond) / 100)}%`,
                                        backgroundColor: colors.greenAccent[500]
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm" style={{ color: colors.grey[300] }}>Interviewed</span>
                            <span className="text-sm" style={{ color: colors.grey[100] }}>
                                {performance_metrics.interviewed_count}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: colors.grey[300] }}>Shortlisted</span>
                            <span className="text-sm" style={{ color: colors.grey[100] }}>
                                {performance_metrics.shortlisted_count}
                            </span>
                        </div>
                    </div>

                    {/* Document Status */}
                    <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="flex items-center mb-4">
                            <DocumentsIcon style={{ color: colors.grey[300], marginRight: '0.5rem' }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.grey[100] }}>
                                Document Status
                            </h3>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm" style={{ color: colors.grey[300] }}>Total Documents</span>
                            <span className="text-sm" style={{ color: colors.grey[100] }}>
                                {document_status.total_documents}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm" style={{ color: colors.grey[300] }}>Pending</span>
                            <span className="text-sm" style={{ color: colors.grey[100] }}>
                                {document_status.pending}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm" style={{ color: colors.grey[300] }}>Approved</span>
                            <span className="text-sm" style={{ color: colors.grey[100] }}>
                                {document_status.approved}
                            </span>
                        </div>
                        {document_status.latest_document && (
                            <p className="text-xs" style={{ color: colors.grey[400] }}>
                                Latest: {document_status.latest_document}
                            </p>
                        )}
                    </div>

                    {/* Skill Insights */}
                    <div className="rounded-lg shadow p-4" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="flex items-center mb-4">
                            <SkillsIcon style={{ color: colors.grey[300], marginRight: '0.5rem' }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.grey[100] }}>
                                Skill Insights
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y" style={{ borderColor: colors.grey[700] }}>
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.grey[300] }}>Skill</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.grey[300] }}>Candidates</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.grey[300] }}>Avg. Proficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: colors.grey[700] }}>
                                    {skill_insights.map((skill, index) => (
                                        <tr key={index}>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm" style={{ color: colors.grey[100] }}>{skill.skill}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm text-right" style={{ color: colors.grey[100] }}>{skill.count}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm" style={{ color: colors.grey[100] }}>
                                                <div className="flex items-center justify-end">
                                                    <div className="w-3/5 h-2 rounded-full mr-2" style={{ backgroundColor: colors.grey[700] }}>
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{ 
                                                                width: `${(skill.avg_proficiency / 3) * 100}%`,
                                                                backgroundColor: colors.greenAccent[500]
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span>{skill.avg_proficiency.toFixed(1)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;