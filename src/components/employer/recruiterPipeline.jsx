import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    Tabs,
    Tab,
    Chip,
    useTheme,
    Button,
    CircularProgress,
    Menu,
    MenuItem,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Pagination
} from '@mui/material';
import { tokens } from '../../theme';
import api from '../../api/api';
import { useAuth } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    CalendarToday as InterviewIcon,
    Work as HiredIcon,
    Block as RejectedIcon,
    MoreVert as MoreIcon,
    LocationOn,
    Business
} from '@mui/icons-material';


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


const RecruitmentPipeline = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tabValue, setTabValue] = useState(0);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [notesDialogOpen, setNotesDialogOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [page, setPage] = useState(1);
    const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
    const [currentStatusUpdate, setCurrentStatusUpdate] = useState({
        recruitmentId: null,
        status: null,
        notes: '',
        interviewDate: null,
        firstName: '',
        lastName: ''
    });
    const [jobDetailsDialogOpen, setJobDetailsDialogOpen] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [jobDetailsLoading, setJobDetailsLoading] = useState(false);

    const statusTabs = [
        { value: 'all', label: 'All Candidates' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'hired', label: 'Hired' },
        { value: 'rejected', label: 'Rejected' }
    ];

    const statusColors = {
        shortlisted: colors.blueAccent[500],
        interviewed: colors.yellowAccent[500],
        hired: colors.greenAccent[500],
        rejected: colors.redAccent[500]
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/recruiter/tracking/`);
            console.log(response.data)
            setCandidates(response.data);
        } catch (err) {
            handleError(err, 'Failed to fetch candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (recruitmentId, status) => {
        try {
            await api.put(`/recruiter/tracking/manage/${recruitmentId}/`, { status });
            setSnackbar({
                open: true,
                message: `Candidate status updated to ${status}`,
                severity: 'success'
            });
            fetchCandidates();
        } catch (err) {
            handleError(err, 'Failed to update status');
        }
    };

    const handleUpdateNotes = async (recruitmentId) => {
        try {
            await api.put(`/recruiter/tracking/manage/${recruitmentId}/`, { notes });
            setSnackbar({
                open: true,
                message: 'Notes updated successfully',
                severity: 'success'
            });
            setNotesDialogOpen(false);
            fetchCandidates();
        } catch (err) {
            handleError(err, 'Failed to update notes');
        }
    };

    const handleMenuClick = (event, candidate) => {
        setAnchorEl(event.currentTarget);
        setSelectedCandidate(candidate);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenNotesDialog = (candidate) => {
        if (!candidate?.recruitmentId) {
            setSnackbar({
                open: true,
                message: 'Invalid candidate data',
                severity: 'error'
            });
            return;
        }
        setSelectedCandidate(candidate);
        setNotes(candidate.notes || '');
        setNotesDialogOpen(true);
    };

    const handleViewProfile = (jobSeekerId) => {
        navigate(`/user/${jobSeekerId}/profile`);
    };

    const handleCloseNotesDialog = () => {
        setNotesDialogOpen(false);
        setSelectedCandidate(null);
    };

    const handleError = (err, defaultMessage) => {
        console.error(err);
        setSnackbar({
            open: true,
            message: err.response?.data?.message || defaultMessage,
            severity: 'error'
        });
    };

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
        setPage(1);
    };

    const handleViewJobPost = async (jobPostingId) => {
        if (!jobPostingId) {
            setSnackbar({ open: true, message: 'No job post associated with this application.', severity: 'warning' });
            return;
        }
        setJobDetailsLoading(true);
        setJobDetailsDialogOpen(true);
        try {
            const response = await api.get(`/job-postings/${jobPostingId}/`);
            setSelectedJobDetails(response.data);
        } catch (err) {
            handleError(err, 'Failed to fetch job details');
            setJobDetailsDialogOpen(false);
        } finally {
            setJobDetailsLoading(false);
        }
    };

    const handleOpenStatusUpdateDialog = (candidate, status) => {
        if (!candidate) return;

        // Convert backend format (2024-03-19 14:30:00.000000) to datetime-local format (2024-03-19T14:30)
        const formatDateForInput = (backendDate) => {
            if (!backendDate) return '';

            // Replace space with T and remove milliseconds if present
            const isoString = backendDate.replace(' ', 'T').split('.')[0];
            // Take first 16 characters (YYYY-MM-DDTHH:MM)
            return isoString.slice(0, 16);
        };

        setCurrentStatusUpdate({
            recruitmentId: candidate.recruitmentId,
            status: status,
            notes: candidate.notes || '',
            interviewDate: formatDateForInput(candidate.interviewDate),
            firstName: candidate.firstName,
            lastName: candidate.lastName
        });
        setStatusUpdateDialogOpen(true);
    };

    const handleStatusUpdateSubmit = async () => {
        const { recruitmentId, status, notes, interviewDate } = currentStatusUpdate;

        if (!recruitmentId || !status) return;

        if (status === 'interviewed' && !interviewDate) {
            setSnackbar({
                open: true,
                message: 'Interview date is required when status is "interviewed"',
                severity: 'error'
            });
            return;
        }

        try {

            const formatDateForBackend = (inputDate) => {
                if (!inputDate) return null;
                return `${inputDate.replace('T', ' ')}:00.000000`;
            };

            const payload = {
                status,
                notes,
                interviewDate: formatDateForBackend(interviewDate)
            };

            console.log('Submitting:', payload);

            await api.put(`/recruiter/tracking/manage/${recruitmentId}/`, payload);

            setSnackbar({
                open: true,
                message: 'Status updated successfully',
                severity: 'success'
            });
            setStatusUpdateDialogOpen(false);
            fetchCandidates();
        } catch (err) {
            handleError(err, 'Failed to update status');
        }
    };


    const filteredCandidates = tabValue === 0
        ? candidates
        : candidates.filter(c => c.status === statusTabs[tabValue].value);

    const paginatedCandidates = filteredCandidates.slice((page - 1) * 10, page * 10);

    return (
        <Box m="20px">
            <Typography variant="h4" color={colors.grey[100]} mb={3}>
                Recruitment Pipeline
            </Typography>

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: colors.greenAccent[500],
                    },
                    '& .MuiTab-root': {
                        color: colors.grey[300],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500],
                        },
                    }
                }}
            >
                {statusTabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} />
                ))}
            </Tabs>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <Box mt={3}>
                    {paginatedCandidates.length === 0 ? (
                        <Typography variant="h6" color={colors.grey[300]} textAlign="center" my={4}>
                            No candidates found in this category
                        </Typography>
                    ) : (
                        <>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {paginatedCandidates.map((candidate) => (
                                    <Card key={candidate.recruitmentId} sx={{
                                        backgroundColor: colors.primary[400],
                                        borderLeft: `4px solid ${statusColors[candidate.status] || colors.grey[700]}`
                                    }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{
                                                        width: 60,
                                                        height: 60,
                                                        backgroundColor: colors.blueAccent[500],
                                                        cursor: 'pointer'
                                                    }}
                                                        onClick={() => handleViewProfile(candidate.job_seeker, candidate.firstName)}>
                                                        {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0) || ''}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h5" color={colors.grey[100]}>
                                                            {candidate.firstName} {candidate.lastName}
                                                        </Typography>
                                                        <Typography variant="body2" color={colors.greenAccent[500]}>
                                                            {candidate.githubUrl || candidate.linkedinUrl || 'No profile links'}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip
                                                        label={candidate.status_display || candidate.status}
                                                        sx={{
                                                            backgroundColor: statusColors[candidate.status],
                                                            color: colors.grey[900],
                                                            fontWeight: 'bold',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={(e) => handleMenuClick(e, candidate)}
                                                        sx={{ color: colors.grey[100] }}
                                                    >
                                                        <MoreIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ my: 2 }} />

                                            {candidate.job_post_id ? (
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {candidate.job_post_title || 'No Title'}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                        <LocationOn sx={{ color: colors.grey[300], fontSize: '1rem' }} />
                                                        <Typography variant="body2" color={colors.grey[300]}>
                                                            {candidate.job_post_location || 'No Location'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color={colors.grey[500]}>
                                                    Job details not available.
                                                </Typography>
                                            )}

                                            {candidate.notes && (
                                                <Box mt={2}>
                                                    <Typography variant="subtitle2" color={colors.grey[300]}>
                                                        Notes:
                                                    </Typography>
                                                    <Typography variant="body1" color={colors.grey[400]}>
                                                        {candidate.notes}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {candidate.interviewDate && (
                                                <Box mt={2}>
                                                    <Typography variant="subtitle2" color={colors.grey[300]}>
                                                        Interview Date:
                                                    </Typography>
                                                    <Typography variant="body1" color={colors.grey[400]}>
                                                        {new Date(candidate.interviewDate).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<ViewIcon />}
                                                    onClick={() => handleViewProfile(candidate.job_seeker, candidate.firstName)}
                                                    sx={{
                                                        color: colors.grey[100],
                                                        borderColor: colors.grey[500],
                                                        '&:hover': {
                                                            borderColor: colors.grey[400],
                                                        }
                                                    }}
                                                >
                                                    View Profile
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<ViewIcon />}
                                                    onClick={() => handleViewJobPost(candidate.job_post_id)}
                                                    sx={{
                                                        color: colors.grey[100],
                                                        borderColor: colors.grey[500],
                                                        '&:hover': {
                                                            borderColor: colors.grey[400],
                                                        }
                                                    }}
                                                >
                                                    View Job
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<InterviewIcon />}
                                                    onClick={() => handleOpenStatusUpdateDialog(candidate, 'interviewed')}
                                                    disabled={candidate.status === 'hired' || candidate.status === 'rejected'}
                                                    sx={{
                                                        color: colors.yellowAccent[500],
                                                        borderColor: colors.yellowAccent[500],
                                                        '&:hover': {
                                                            borderColor: colors.yellowAccent[400],
                                                        }
                                                    }}
                                                >
                                                    Interview
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<HiredIcon />}
                                                    onClick={() => handleUpdateStatus(candidate.recruitmentId, 'hired')}
                                                    disabled={candidate.status === 'rejected'}
                                                    sx={{
                                                        color: colors.greenAccent[500],
                                                        borderColor: colors.greenAccent[500],
                                                        '&:hover': {
                                                            borderColor: colors.greenAccent[400],
                                                        }
                                                    }}
                                                >
                                                    Hire
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<RejectedIcon />}
                                                    onClick={() => handleUpdateStatus(candidate.recruitmentId, 'rejected')}
                                                    disabled={candidate.status === 'hired'}
                                                    sx={{
                                                        color: colors.redAccent[500],
                                                        borderColor: colors.redAccent[500],
                                                        '&:hover': {
                                                            borderColor: colors.redAccent[400],
                                                        }
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                            <Box display="flex" justifyContent="center" mt={3}>
                                <Pagination
                                    count={Math.ceil(filteredCandidates.length / 10)}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="secondary"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleViewProfile(selectedCandidate?.job_seeker, selectedCandidate?.firstName);
                    handleMenuClose();
                }}>
                    <ViewIcon sx={{ mr: 1 }} /> View Analytics
                </MenuItem>
                <MenuItem onClick={() => {
                    handleOpenNotesDialog(selectedCandidate);
                    handleMenuClose();
                }}>
                    <EditIcon sx={{ mr: 1 }} /> Edit Notes
                </MenuItem>
                <MenuItem onClick={() => {
                    handleOpenStatusUpdateDialog(selectedCandidate, 'shortlisted');
                    handleMenuClose();
                }}>
                    <InterviewIcon sx={{ mr: 1 }} /> Shortlist
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleUpdateStatus(selectedCandidate?.recruitmentId, 'rejected');
                    handleMenuClose();
                }} sx={{ color: colors.redAccent[500] }}>
                    <RejectedIcon sx={{ mr: 1 }} /> Reject Candidate
                </MenuItem>
            </Menu>

            {/* Notes Dialog */}
            <Dialog open={notesDialogOpen} onClose={handleCloseNotesDialog}>
                <DialogTitle>
                    {selectedCandidate ? `Edit Notes for ${selectedCandidate.firstName}` : 'Edit Notes'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Notes"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mt: 2, minWidth: '400px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNotesDialog}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (selectedCandidate?.recruitmentId) {
                                handleUpdateNotes(selectedCandidate.recruitmentId);
                            }
                        }}
                        variant="contained"
                        disabled={!selectedCandidate?.recruitmentId || !notes.trim()}
                    >
                        Save Notes
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)}>
                <DialogTitle>Update status for {currentStatusUpdate.firstName} {currentStatusUpdate.lastName}</DialogTitle>
                <DialogContent>
                    <Typography>
                        New status: <strong>{currentStatusUpdate.status}</strong>
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Notes"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={currentStatusUpdate.notes}
                        onChange={(e) => setCurrentStatusUpdate(prev => ({
                            ...prev,
                            notes: e.target.value
                        }))}
                        sx={{ mt: 2, minWidth: '400px' }}
                    />

                    {/* Conditionally show interview date only for interviewed status */}
                    {currentStatusUpdate.status === 'interviewed' && (
                        <TextField
                            margin="dense"
                            label="Interview Date"
                            type="datetime-local"
                            fullWidth
                            variant="outlined"
                            value={currentStatusUpdate.interviewDate || ''}
                            onChange={(e) => setCurrentStatusUpdate(prev => ({
                                ...prev,
                                interviewDate: e.target.value
                            }))}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mt: 2 }}
                            required
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusUpdateDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleStatusUpdateSubmit}
                        variant="contained"
                    >
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            <JobDetailsDialog
                open={jobDetailsDialogOpen}
                onClose={() => setJobDetailsDialogOpen(false)}
                jobDetails={selectedJobDetails}
                loading={jobDetailsLoading}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}; ""

export default RecruitmentPipeline;