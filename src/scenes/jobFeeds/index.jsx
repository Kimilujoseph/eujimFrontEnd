import React, { useState, useEffect, useCallback } from 'react';
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
    Snackbar,
    Alert,
    Grid,
    Paper,
    Link,
    Avatar,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    TextField,
    InputAdornment
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import api from '../../api/api';
import { useAuth } from '../../auth/authContext';
import { Business, LocationOn, WorkOutline, CheckCircleOutline, BookmarkBorder, Share, MoreHoriz, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const JobDetailsDialog = ({ open, onClose, jobDetails, loading }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
            <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary[500]}` }}>Job Details</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : jobDetails ? (
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{jobDetails.title}</Typography>
                        <Typography variant="h6" color="text.secondary">{jobDetails.recruiter_company}</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>{jobDetails.location}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Description</Typography>
                        <Typography paragraph>{jobDetails.description}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Responsibilities</Typography>
                        <Typography paragraph>{jobDetails.responsibilities}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Requirements</Typography>
                        <Typography paragraph>{jobDetails.requirements}</Typography>
                    </Box>
                ) : (
                    <Typography>No details available.</Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ borderTop: `1px solid ${colors.primary[500]}` }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

const JobCardSkeleton = () => {
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
                <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <Skeleton variant="rounded" width={100} height={32} />
                    <Skeleton variant="rounded" width={100} height={32} />
                    <Skeleton variant="rounded" width={150} height={32} />
                </Box>
            </CardContent>
            <CardActions sx={{ padding: '0 24px 24px', justifyContent: 'flex-end' }}>
                <Skeleton variant="rounded" width={120} height={40} />
            </CardActions>
        </Card>
    );
};


const JobCard = ({ job, handleEasyApply, applying, appliedJobs, handleViewMore }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isApplied = appliedJobs.includes(job.id);

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
                        <Avatar
                            sx={{ width: 56, height: 56, bgcolor: colors.blueAccent[500] }}
                            src={job.company_logo}
                        >
                            {job.recruiter_company.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{
                                fontWeight: 600,
                                color: colors.grey[100],
                                fontSize: '1.25rem',
                                lineHeight: 1.3
                            }}>
                                {job.title}
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: colors.grey[300],
                                mt: 0.5
                            }}>
                                {job.recruiter_company}
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: colors.grey[500],
                                mt: 0.5
                            }}>
                                {job.location}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton>
                        <BookmarkBorder sx={{ color: colors.grey[300] }} />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.primary[500] }} />

                <Box sx={{ mb: 3 }}>
                    <Button onClick={() => handleViewMore(job.id)} sx={{ ml: 1 }}>See more</Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <Chip
                        icon={<WorkOutline />}
                        label={job.job_type.replace('_', ' ')}
                        sx={{
                            backgroundColor: colors.blueAccent[800],
                            color: colors.grey[100],
                            textTransform: 'capitalize'
                        }}
                    />
                    <Chip
                        label={job.experience_level.replace('_', ' ')}
                        sx={{
                            backgroundColor: colors.greenAccent[800],
                            color: colors.grey[100],
                            textTransform: 'capitalize'
                        }}
                    />
                    <Chip
                        label={`${job.salary_range_min} - ${job.salary_range_max}`}
                        sx={{
                            backgroundColor: colors.primary[500],
                            color: colors.grey[100]
                        }}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: colors.grey[300], mb: 1 }}>Skills:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.required_skills?.map((skill) => (
                            <Chip key={skill.id} label={skill.skill_name} size="small" sx={{ backgroundColor: colors.blueAccent[700] }} />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                        {new Date(job.posted_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                            <Share sx={{ fontSize: '1rem', color: colors.grey[300] }} />
                        </IconButton>
                        <IconButton size="small">
                            <MoreHoriz sx={{ fontSize: '1rem', color: colors.grey[300] }} />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{
                padding: '0 24px 24px',
                justifyContent: 'flex-end'
            }}>
                <Button
                    variant="contained"
                    color={isApplied ? "success" : "secondary"}
                    onClick={() => handleEasyApply(job.id, job.recruiter_id)}
                    disabled={applying || isApplied}
                    startIcon={isApplied ? <CheckCircleOutline /> : null}
                    sx={{
                        minWidth: '120px',
                        borderRadius: '24px',
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '8px 24px'
                    }}
                >
                    {isApplied ? 'Applied' : (applying ? <CircularProgress size={20} /> : 'Apply')}
                </Button>
            </CardActions>
        </Card>
    );
};

const JobFeeds = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [applying, setApplying] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchJobs = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/job-postings/?page=${pageNum}&limit=10`);
            setJobs(response.data.results);
            setFilteredJobs(response.data.results);
            setTotalPages(Math.ceil(response.data.count / response.data.page_size));
            setError(null);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    setError('No job postings found.');
                } else if (err.response.status === 500) {
                    setError('An internal server error occurred.');
                } else {
                    setError('Failed to fetch job postings.');
                }
            } else {
                setError('A network error occurred.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = jobs.filter(job => {
            const titleMatch = job.title.toLowerCase().includes(lowercasedFilter);
            const companyMatch = job.recruiter_company.toLowerCase().includes(lowercasedFilter);
            const skillsMatch = job.required_skills?.some(skill =>
                skill.skill_name.toLowerCase().includes(lowercasedFilter)
            );
            return titleMatch || companyMatch || skillsMatch;
        });
        setFilteredJobs(filteredData);
    }, [searchTerm, jobs]);


    const handleEasyApply = async (jobId, recruiterId) => {
        setApplying(true);
        try {
            await api.post('/graduate/recruitment-tracking/create/', {
                recruiter_id: recruiterId,
                job_seeker_id: user.id,
                status: 'applied',
                notes: 'Applied via Easy Apply on Job Feeds',
                job_posting_id: jobId
            });
            setSnackbar({ open: true, message: 'Successfully applied!', severity: 'success' });
            setAppliedJobs(prev => [...prev, jobId]);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setSnackbar({ open: true, message: err.response.data.detail || 'You have already applied for this job.', severity: 'warning' });
                } else if (err.response.status === 500) {
                    setSnackbar({ open: true, message: 'An internal server error occurred. Please try again later.', severity: 'error' });
                } else {
                    setSnackbar({ open: true, message: 'Failed to apply.', severity: 'error' });
                }
            } else {
                setSnackbar({ open: true, message: 'A network error occurred.', severity: 'error' });
            }
            console.error(err);
        } finally {
            setApplying(false);
        }
    };

    const handleViewMore = async (jobId) => {
        setDetailsLoading(true);
        setOpenDetailsDialog(true);
        try {
            const response = await api.get(`/job-postings/${jobId}/`);
            setSelectedJobDetails(response.data);
        } catch (err) {
            setError('Failed to fetch job details.');
            console.error(err);
            setOpenDetailsDialog(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{
            maxWidth: '1128px',
            margin: '0 auto',
            padding: '24px 16px',
            display: 'flex',
            gap: '24px'
        }}>
            <Box sx={{ flexGrow: 1, maxWidth: '800px' }}>
                <Header title="Job Feeds" subtitle="Browse and apply for jobs" />
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by title, skill, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    Array.from(new Array(5)).map((_, index) => <JobCardSkeleton key={index} />)
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                handleEasyApply={handleEasyApply}
                                applying={applying}
                                appliedJobs={appliedJobs}
                                handleViewMore={handleViewMore}
                            />
                        ))}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                            gap: 2
                        }}>
                            <Button
                                variant="outlined"
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                sx={{ borderRadius: '24px' }}
                            >
                                Previous
                            </Button>
                            <Typography sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: colors.grey[300]
                            }}>
                                Page {page} of {totalPages}
                            </Typography>
                            <Button
                                variant="outlined"
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                sx={{ borderRadius: '24px' }}
                            >
                                Next
                            </Button>
                        </Box>
                    </>
                )}
            </Box>

            <Box sx={{
                width: '300px',
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' }
            }}>
                <Paper sx={{
                    p: 2,
                    backgroundColor: colors.primary[400],
                    borderRadius: '12px',
                    mb: 2
                }}>
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

            <JobDetailsDialog
                open={openDetailsDialog}
                onClose={() => setOpenDetailsDialog(false)}
                jobDetails={selectedJobDetails}
                loading={detailsLoading}
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JobFeeds;
