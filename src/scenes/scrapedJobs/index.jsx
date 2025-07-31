import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Paper,
  Link,
  Avatar,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { Search, Business, LocationOn, WorkOutline } from '@mui/icons-material';

const ScrapedJobCardSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card sx={{
      marginBottom: '24px',
      backgroundColor: colors.primary[400],
      border: `1px solid ${colors.primary[500]}`,
      borderRadius: '12px',
      width: '100%',
    }}>
      <CardContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Skeleton variant="circular" width={56} height={56} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </Box>
        </Box>
        <Divider sx={{ my: 3, borderColor: colors.primary[500] }} />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="rounded" width={100} height={32} />
        </Box>
      </CardContent>
      <CardActions sx={{ padding: '0 24px 24px', justifyContent: 'flex-end' }}>
        <Skeleton variant="rounded" width={120} height={40} />
      </CardActions>
    </Card>
  );
};

const ScrapedJobCard = ({ job }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card sx={{
      marginBottom: '24px',
      backgroundColor: colors.primary[400],
      border: `1px solid ${colors.primary[500]}`,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 16px ${colors.primary[900]}`
      }
    }}>
      <CardContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: colors.blueAccent[500] }}>
              <Business />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: colors.grey[100], fontSize: '1.25rem', lineHeight: 1.3 }}>
                {job.title}
              </Typography>
              <Typography variant="body1" sx={{ color: colors.grey[300], mt: 0.5 }}>
                {job.company}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[500], mt: 0.5 }}>
                {job.location}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: colors.primary[500] }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Chip
            icon={<WorkOutline />}
            label={job.job_type}
            sx={{ backgroundColor: colors.blueAccent[800], color: colors.grey[100], textTransform: 'capitalize' }}
          />
          <Chip
            label={job.source}
            sx={{ backgroundColor: colors.greenAccent[800], color: colors.grey[100] }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.grey[500] }}>
            {new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ padding: '0 24px 24px', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="secondary"
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ minWidth: '120px', borderRadius: '24px', textTransform: 'none', fontWeight: 600, padding: '8px 24px' }}
        >
          Apply on {job.source}
        </Button>
      </CardActions>
    </Card>
  );
};

const ScrapedJobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ maxWidth: '1128px', margin: '0 auto', padding: '24px 16px', display: 'flex', gap: '24px' }}>
      <Box sx={{ flexGrow: 1, maxWidth: '800px' }}>
        <Header title="External Job Postings" subtitle="Jobs from around the web" />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title or company"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          Array.from(new Array(5)).map((_, index) => <ScrapedJobCardSkeleton key={index} />)
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {currentJobs.map((job) => (
              <ScrapedJobCard key={job.id} job={job} />
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredJobs.length / jobsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="secondary"
              />
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ width: '300px', flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
        <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: '12px', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Profile Strength</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: colors.grey[300] }}>
            Complete your profile to increase your visibility to recruiters
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/profile')}
            fullWidth
            sx={{ borderRadius: '24px' }}
          >
            Complete Profile
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ScrapedJobs;