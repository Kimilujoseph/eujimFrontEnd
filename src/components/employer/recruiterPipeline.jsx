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
    TextField
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
    MoreVert as MoreIcon
} from '@mui/icons-material';

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

    const handleViewAnalytics = (jobSeekerId, firstName) => {
        navigate(`/job-seeker-dashboard/employer-view/${jobSeekerId}/${firstName}`);
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

    const filteredCandidates = tabValue === 0
        ? candidates
        : candidates.filter(c => c.status === statusTabs[tabValue].value);

    return (
        <Box m="20px">
            <Typography variant="h4" color={colors.grey[100]} mb={3}>
                Recruitment Pipeline
            </Typography>

            <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
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
                    {filteredCandidates.length === 0 ? (
                        <Typography variant="h6" color={colors.grey[300]} textAlign="center" my={4}>
                            No candidates found in this category
                        </Typography>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>
                            {filteredCandidates.map((candidate) => (
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
                                                    onClick={() => handleViewAnalytics(candidate.job_seeker_id, candidate.firstName)}>
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

                                        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<ViewIcon />}
                                                onClick={() => handleViewAnalytics(candidate.job_seeker_id, candidate.firstName)}
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
                                                startIcon={<InterviewIcon />}
                                                onClick={() => handleUpdateStatus(candidate.recruitmentId, 'interviewed')}
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
                    handleViewAnalytics(selectedCandidate?.job_seeker_id, selectedCandidate?.firstName);
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
                    handleUpdateStatus(selectedCandidate?.recruitmentId, 'shortlisted');
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
};

export default RecruitmentPipeline;