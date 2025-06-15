import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    useTheme,
    CircularProgress,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Chip,
    Badge,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { tokens } from '../../theme';
import api from '../../api/api';
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
    Update as RecentActivityIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RecruiterDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/recruiter/dashboard/');
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
        skill_insights
    } = dashboardData;

    // Prepare data for the weekly activity chart
    const weeklyActivityData = performance_metrics.weekly_activity.map(item => ({
        day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
        actions: item.actions
    }));

    // Status colors
    const statusColors = {
        hired: colors.greenAccent[500],
        interviewed: colors.yellowAccent[500],
        shortlisted: colors.blueAccent[500],
        rejected: colors.redAccent[500]
    };

    return (
        <Box m="20px">
            <Typography variant="h4" color={colors.grey[100]} mb={3}>
                Recruiter Dashboard
            </Typography>

            {/* Overview Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color={colors.grey[300]}>
                                        Total Candidates
                                    </Typography>
                                    <Typography variant="h3" color={colors.grey[100]}>
                                        {recruitment_overview.total_candidates}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: colors.blueAccent[500] }}>
                                    <CandidatesIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color={colors.grey[300]}>
                                        Hired
                                    </Typography>
                                    <Typography variant="h3" color={colors.greenAccent[500]}>
                                        {recruitment_overview.hired}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: colors.greenAccent[500] }}>
                                    <HiredIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color={colors.grey[300]}>
                                        Interviewed
                                    </Typography>
                                    <Typography variant="h3" color={colors.yellowAccent[500]}>
                                        {recruitment_overview.interviewed}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: colors.yellowAccent[500] }}>
                                    <InterviewedIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color={colors.grey[300]}>
                                        Shortlisted
                                    </Typography>
                                    <Typography variant="h3" color={colors.blueAccent[500]}>
                                        {recruitment_overview.shortlisted}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: colors.blueAccent[500] }}>
                                    <ShortlistedIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color={colors.grey[300]}>
                                        Rejected
                                    </Typography>
                                    <Typography variant="h3" color={colors.redAccent[500]}>
                                        {recruitment_overview.rejected}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: colors.redAccent[500] }}>
                                    <RejectedIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={8}>
                    {/* Weekly Activity Chart */}
                    <Card sx={{ mb: 3, p: 2, backgroundColor: colors.primary[400] }}>
                        <Typography variant="h6" color={colors.grey[100]} mb={2}>
                            Weekly Activity
                        </Typography>
                        <Box height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                                    <XAxis dataKey="day" stroke={colors.grey[100]} />
                                    <YAxis stroke={colors.grey[100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: colors.primary[500],
                                            borderColor: colors.grey[700]
                                        }}
                                    />
                                    <Bar
                                        dataKey="actions"
                                        fill={colors.greenAccent[500]}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>

                    {/* Recent Activities */}
                    <Card sx={{ backgroundColor: colors.primary[400] }}>
                        <Box p={2} display="flex" alignItems="center">
                            <RecentActivityIcon sx={{ color: colors.grey[100], mr: 1 }} />
                            <Typography variant="h6" color={colors.grey[100]}>
                                Recent Activities
                            </Typography>
                        </Box>
                        <Divider sx={{ backgroundColor: colors.grey[700] }} />
                        <List>
                            {recent_activities.map((activity, index) => (
                                <Box key={index}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: statusColors[activity.status] }}>
                                                {activity.job_seeker__user__firstName?.charAt(0)}
                                                {activity.job_seeker__user__lastName?.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${activity.job_seeker__user__firstName} ${activity.job_seeker__user__lastName}`}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color={colors.grey[300]}
                                                    >
                                                        {new Date(activity.updatedAt).toLocaleString()}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" mt={0.5}>
                                                        <Chip
                                                            label={activity.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: statusColors[activity.status],
                                                                color: colors.grey[900],
                                                                mr: 1
                                                            }}
                                                        />
                                                        {activity.notes && (
                                                            <Typography
                                                                variant="body2"
                                                                color={colors.grey[400]}
                                                            >
                                                                {activity.notes}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < recent_activities.length - 1 && (
                                        <Divider variant="inset" component="li" sx={{ backgroundColor: colors.grey[700] }} />
                                    )}
                                </Box>
                            ))}
                        </List>
                    </Card>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                    {/* Performance Metrics */}
                    <Card sx={{ mb: 3, p: 2, backgroundColor: colors.primary[400] }}>
                        <Typography variant="h6" color={colors.grey[100]} mb={2}>
                            Performance Metrics
                        </Typography>
                        <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color={colors.grey[300]}>
                                    Avg. Response Time
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <ResponseTimeIcon sx={{ color: colors.grey[300], fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2" color={colors.grey[100]}>
                                        {Math.round(parseFloat(performance_metrics.avg_time_to_respond) / 3600)} hours
                                    </Typography>
                                </Box>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, parseFloat(performance_metrics.avg_time_to_respond) / 100)}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: colors.grey[700],
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: colors.greenAccent[500]
                                    }
                                }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={colors.grey[300]}>
                                Interviewed
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {performance_metrics.interviewed_count}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="body2" color={colors.grey[300]}>
                                Shortlisted
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {performance_metrics.shortlisted_count}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Document Status */}
                    <Card sx={{ mb: 3, p: 2, backgroundColor: colors.primary[400] }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <DocumentsIcon sx={{ color: colors.grey[100], mr: 1 }} />
                            <Typography variant="h6" color={colors.grey[100]}>
                                Document Status
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={colors.grey[300]}>
                                Total Documents
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {document_status.total_documents}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={colors.grey[300]}>
                                Pending
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {document_status.pending}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="body2" color={colors.grey[300]}>
                                Approved
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]}>
                                {document_status.approved}
                            </Typography>
                        </Box>
                        {document_status.latest_document && (
                            <Typography variant="body2" color={colors.grey[400]}>
                                Latest: {document_status.latest_document}
                            </Typography>
                        )}
                    </Card>

                    {/* Skill Insights */}
                    <Card sx={{ p: 2, backgroundColor: colors.primary[400] }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <SkillsIcon sx={{ color: colors.grey[100], mr: 1 }} />
                            <Typography variant="h6" color={colors.grey[100]}>
                                Skill Insights
                            </Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: colors.grey[300] }}>Skill</TableCell>
                                        <TableCell align="right" sx={{ color: colors.grey[300] }}>Candidates</TableCell>
                                        <TableCell align="right" sx={{ color: colors.grey[300] }}>Avg. Proficiency</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {skill_insights.map((skill, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ color: colors.grey[100] }}>{skill.skill}</TableCell>
                                            <TableCell align="right" sx={{ color: colors.grey[100] }}>
                                                {skill.count}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box display="flex" alignItems="center" justifyContent="flex-end">
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(skill.avg_proficiency / 3) * 100}
                                                        sx={{
                                                            width: '60%',
                                                            height: 8,
                                                            borderRadius: 4,
                                                            mr: 1,
                                                            backgroundColor: colors.grey[700],
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: colors.greenAccent[500]
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="body2" color={colors.grey[100]}>
                                                        {skill.avg_proficiency.toFixed(1)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RecruiterDashboard;