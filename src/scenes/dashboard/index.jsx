import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { tokens } from "../../theme";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as EducationIcon,
  WorkspacePremium as CertificationIcon,
  Timeline as GrowthIcon,
  LocationOn as LocationIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from "../../api/api"

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/manage/admin/dashboard');
        setDashboardData(response.data);
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
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Typography variant="h6" style={{ color: colors.grey[100] }}>
          Failed to load dashboard data
        </Typography>
      </div>
    );
  }

  const {
    user_metrics,
    skill_metrics,
    education_metrics,
    certification_metrics,
    growth_metrics,
    engagement_metrics,
    demographic_metrics
  } = dashboardData;

  // Prepare data for charts
  const userGrowthData = growth_metrics.user_growth.map(item => ({
    name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    users: item.count
  }));

  const skillGrowthData = growth_metrics.skill_growth.map(item => ({
    name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    skills: item.count
  }));

  const proficiencyData = Object.entries(skill_metrics.proficiency_distribution).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = [
    colors.blueAccent[500],
    colors.greenAccent[500],
    colors.yellowAccent[500],
    colors.redAccent[500]
  ];

  return (
    <div className="p-5 max-w-[1800px] mx-auto">
      <Typography variant="h2" style={{ color: colors.grey[100] }} className="font-bold mb-8">
        Admin Dashboard
      </Typography>

      {/* User Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card style={{ backgroundColor: colors.primary[400] }}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Typography variant="h6" style={{ color: colors.grey[300] }}>
                  Total Job Seekers
                </Typography>
                <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
                  {user_metrics.total_job_seekers}
                </Typography>
              </div>
              <Avatar style={{ backgroundColor: colors.blueAccent[500] }}>
                <PeopleIcon />
              </Avatar>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Typography variant="h6" style={{ color: colors.grey[300] }}>
                  Profile Completion
                </Typography>
                <Typography variant="h3" style={{ color: colors.yellowAccent[500] }}>
                  {user_metrics.avg_profile_completion}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={user_metrics.avg_profile_completion}
                  style={{
                    height: 8,
                    borderRadius: 16,
                    marginTop: 8,
                    backgroundColor: colors.grey[700],
                  }}
                  classes={{
                    bar: `bg-[${colors.yellowAccent[500]}]`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Typography variant="h6" style={{ color: colors.grey[300] }}>
                  New Profiles (30d)
                </Typography>
                <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
                  {user_metrics.profiles_added_last_30d}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Typography variant="h6" style={{ color: colors.grey[300] }}>
                  Updated Profiles
                </Typography>
                <Typography variant="h3" style={{ color: colors.blueAccent[500] }}>
                  {user_metrics.recently_updated_profiles}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <div className="flex items-center mb-4">
            <BarChartIcon style={{ color: colors.grey[100], marginRight: 8 }} />
            <Typography variant="h6" style={{ color: colors.grey[100] }}>
              User Growth
            </Typography>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                <XAxis
                  dataKey="name"
                  stroke={colors.grey[100]}
                />
                <YAxis stroke={colors.grey[100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.primary[500],
                    borderColor: colors.grey[700],
                    color: colors.grey[100]
                  }}
                />
                <Legend />
                <Bar
                  dataKey="users"
                  fill={colors.blueAccent[500]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <div className="flex items-center mb-4">
            <LineChartIcon style={{ color: colors.grey[100], marginRight: 8 }} />
            <Typography variant="h6" style={{ color: colors.grey[100] }}>
              Skill Growth
            </Typography>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                <XAxis
                  dataKey="name"
                  stroke={colors.grey[100]}
                />
                <YAxis stroke={colors.grey[100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.primary[500],
                    borderColor: colors.grey[700],
                    color: colors.grey[100]
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="skills"
                  stroke={colors.greenAccent[500]}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Skill Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <Typography variant="h6" style={{ color: colors.grey[100] }} className="mb-4">
            Top Skills
          </Typography>
          <div>
            {skill_metrics.top_skills.slice(0, 5).map((skill, index) => (
              <div
                key={index}
                className="flex justify-between mb-2 p-2 rounded"
                style={{
                  backgroundColor: colors.primary[600],
                }}
              >
                <Typography style={{ color: colors.grey[100] }}>{skill.skill}</Typography>
                <Typography style={{ color: colors.grey[100] }}>
                  {skill.users} users ({skill.avg_proficiency}/5)
                </Typography>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <Typography variant="h6" style={{ color: colors.grey[100] }} className="mb-4">
            Proficiency Distribution
          </Typography>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={proficiencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {proficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.primary[500],
                    borderColor: colors.grey[700],
                    color: colors.grey[100]
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <Typography variant="h6" style={{ color: colors.grey[100] }} className="mb-4">
            Skill Stats
          </Typography>
          <div>
            <div className="mb-6">
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Total Skills
              </Typography>
              <Typography variant="h4" style={{ color: colors.blueAccent[500] }}>
                {skill_metrics.total_skills}
              </Typography>
            </div>
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Top Skill
              </Typography>
              <Typography variant="h5" style={{ color: colors.greenAccent[500] }}>
                {skill_metrics.top_skills[0]?.skill || 'N/A'}
              </Typography>
              <Typography variant="body2" style={{ color: colors.grey[400] }}>
                {skill_metrics.top_skills[0]?.users || 0} users
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Education & Certification Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <div className="flex items-center mb-4">
            <EducationIcon style={{ color: colors.grey[100], marginRight: 8 }} />
            <Typography variant="h6" style={{ color: colors.grey[100] }}>
              Education Metrics
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Total Educations
              </Typography>
              <Typography variant="h4" style={{ color: colors.blueAccent[500] }}>
                {education_metrics.total_educations}
              </Typography>
            </div>
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Avg Years
              </Typography>
              <Typography variant="h4" style={{ color: colors.yellowAccent[500] }}>
                {education_metrics.avg_education_years}
              </Typography>
            </div>
            <div className="col-span-2">
              <Typography variant="body1" style={{ color: colors.grey[300] }} className="mt-4">
                Degree Distribution
              </Typography>
              <div className="mt-2">
                {education_metrics.degree_distribution.map((degree, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <Typography style={{ color: colors.grey[100] }} className="capitalize">
                      {degree.degree}
                    </Typography>
                    <Typography style={{ color: colors.grey[100] }}>{degree.count}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <div className="flex items-center mb-4">
            <CertificationIcon style={{ color: colors.grey[100], marginRight: 8 }} />
            <Typography variant="h6" style={{ color: colors.grey[100] }}>
              Certification Metrics
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Total Certifications
              </Typography>
              <Typography variant="h4" style={{ color: colors.greenAccent[500] }}>
                {certification_metrics.total_certifications}
              </Typography>
            </div>
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Avg per User
              </Typography>
              <Typography variant="h4" style={{ color: colors.blueAccent[500] }}>
                {certification_metrics.avg_certs_per_user}
              </Typography>
            </div>
            <div className="col-span-2">
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Recently Added
              </Typography>
              <Typography variant="h4" style={{ color: colors.yellowAccent[500] }}>
                {engagement_metrics.certifications_added}
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement & Demographic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <Typography variant="h6" style={{ color: colors.grey[100] }} className="mb-4">
            Engagement Metrics
          </Typography>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Typography variant="body2" style={{ color: colors.grey[300] }}>
                Skills Added
              </Typography>
              <Typography variant="h5" style={{ color: colors.blueAccent[500] }}>
                {engagement_metrics.skills_added}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" style={{ color: colors.grey[300] }}>
                Educations Added
              </Typography>
              <Typography variant="h5" style={{ color: colors.greenAccent[500] }}>
                {engagement_metrics.educations_added}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" style={{ color: colors.grey[300] }}>
                Certifications Added
              </Typography>
              <Typography variant="h5" style={{ color: colors.yellowAccent[500] }}>
                {engagement_metrics.certifications_added}
              </Typography>
            </div>
          </div>
        </Card>

        <Card style={{ backgroundColor: colors.primary[400] }} className="p-4">
          <div className="flex items-center mb-4">
            <LocationIcon style={{ color: colors.grey[100], marginRight: 8 }} />
            <Typography variant="h6" style={{ color: colors.grey[100] }}>
              Demographic Metrics
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Users with Location
              </Typography>
              <Typography variant="h4" style={{ color: colors.blueAccent[500] }}>
                {demographic_metrics.users_with_location}
              </Typography>
            </div>
            <div>
              <Typography variant="body1" style={{ color: colors.grey[300] }}>
                Top Locations
              </Typography>
              <div className="mt-2">
                {demographic_metrics.top_locations.map((location, index) => (
                  <Typography key={index} style={{ color: colors.grey[100] }}>
                    {location.location}: {location.count}
                  </Typography>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;