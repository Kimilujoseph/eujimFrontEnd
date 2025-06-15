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
    Update as RecentActivityIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/api';

const RecruiterDashboard = () => {
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
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <h2 className="text-xl font-semibold">Failed to load dashboard data</h2>
            </div>
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
        hired: 'bg-green-500',
        interviewed: 'bg-yellow-500',
        shortlisted: 'bg-blue-500',
        rejected: 'bg-red-500'
    };

    const textColors = {
        hired: 'text-green-500',
        interviewed: 'text-yellow-500',
        shortlisted: 'text-blue-500',
        rejected: 'text-red-500'
    };

    return (
        <div className="p-5 w-full max-w-full overflow-x-hidden">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Recruiter Dashboard
            </h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 w-full">
                {/* Total Candidates */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Candidates</h3>
                            <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                                {recruitment_overview.total_candidates}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-blue-100 dark:bg-blue-900`}>
                            <CandidatesIcon className="text-blue-500 dark:text-blue-300" />
                        </div>
                    </div>
                </div>

                {/* Hired */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Hired</h3>
                            <p className={`text-3xl font-semibold ${textColors.hired}`}>
                                {recruitment_overview.hired}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-green-100 dark:bg-green-900`}>
                            <HiredIcon className="text-green-500 dark:text-green-300" />
                        </div>
                    </div>
                </div>

                {/* Interviewed */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Interviewed</h3>
                            <p className={`text-3xl font-semibold ${textColors.interviewed}`}>
                                {recruitment_overview.interviewed}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-yellow-100 dark:bg-yellow-900`}>
                            <InterviewedIcon className="text-yellow-500 dark:text-yellow-300" />
                        </div>
                    </div>
                </div>

                {/* Shortlisted */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Shortlisted</h3>
                            <p className={`text-3xl font-semibold ${textColors.shortlisted}`}>
                                {recruitment_overview.shortlisted}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-blue-100 dark:bg-blue-900`}>
                            <ShortlistedIcon className="text-blue-500 dark:text-blue-300" />
                        </div>
                    </div>
                </div>

                {/* Rejected */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Rejected</h3>
                            <p className={`text-3xl font-semibold ${textColors.rejected}`}>
                                {recruitment_overview.rejected}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-red-100 dark:bg-red-900`}>
                            <RejectedIcon className="text-red-500 dark:text-red-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="md:col-span-2 space-y-6">
                    {/* Weekly Activity Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Weekly Activity
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                                    <XAxis
                                        dataKey="day"
                                        className="text-xs fill-gray-500 dark:fill-gray-400"
                                    />
                                    <YAxis className="text-xs fill-gray-500 dark:fill-gray-400" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgb(255 255 255 / var(--tw-bg-opacity))',
                                            borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                            color: 'rgb(17 24 39 / var(--tw-text-opacity))'
                                        }}
                                        itemStyle={{
                                            color: 'rgb(17 24 39 / var(--tw-text-opacity))'
                                        }}
                                        labelStyle={{
                                            color: 'rgb(17 24 39 / var(--tw-text-opacity))',
                                            fontWeight: '600'
                                        }}
                                    />
                                    <Bar
                                        dataKey="actions"
                                        fill="#4ade80"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
                            <RecentActivityIcon className="text-gray-700 dark:text-gray-300 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Recent Activities
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recent_activities.map((activity, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex items-start">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${statusColors[activity.status]} flex items-center justify-center text-white`}>
                                            {activity.job_seeker__user__firstName?.charAt(0)}
                                            {activity.job_seeker__user__lastName?.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {activity.job_seeker__user__firstName} {activity.job_seeker__user__lastName}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(activity.updatedAt).toLocaleString()}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[activity.status]} text-white`}>
                                                    {activity.status}
                                                </span>
                                                {activity.notes && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Performance Metrics
                        </h3>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Response Time</span>
                                <div className="flex items-center">
                                    <ResponseTimeIcon className="text-gray-500 dark:text-gray-400 text-sm mr-1" />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">
                                        {Math.round(parseFloat(performance_metrics.avg_time_to_respond) / 3600)} hours
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(100, parseFloat(performance_metrics.avg_time_to_respond) / 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Interviewed</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                                {performance_metrics.interviewed_count}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Shortlisted</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                                {performance_metrics.shortlisted_count}
                            </span>
                        </div>
                    </div>

                    {/* Document Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center mb-4">
                            <DocumentsIcon className="text-gray-700 dark:text-gray-300 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Document Status
                            </h3>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Documents</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                                {document_status.total_documents}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                                {document_status.pending}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Approved</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                                {document_status.approved}
                            </span>
                        </div>
                        {document_status.latest_document && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Latest: {document_status.latest_document}
                            </p>
                        )}
                    </div>

                    {/* Skill Insights */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center mb-4">
                            <SkillsIcon className="text-gray-700 dark:text-gray-300 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Skill Insights
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skill</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidates</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Proficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {skill_insights.map((skill, index) => (
                                        <tr key={index}>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{skill.skill}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-right">{skill.count}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                <div className="flex items-center justify-end">
                                                    <div className="w-3/5 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                                                        <div
                                                            className="h-2 bg-green-500 rounded-full"
                                                            style={{ width: `${(skill.avg_proficiency / 3) * 100}%` }}
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