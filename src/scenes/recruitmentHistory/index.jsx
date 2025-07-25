import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Link as MuiLink,
    useTheme,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from "@mui/material";
import { tokens } from "../../theme";
import api from "../../api/api";
import { Business, LocationOn, Event } from "@mui/icons-material";

const statusColorMap = (colors) => ({
    interviewed: colors.yellowAccent[600],
    shortlisted: colors.blueAccent[600],
    rejected: colors.redAccent[600],
    hired: colors.greenAccent[600],
    applied: colors.grey[700],
});

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

const InterviewHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const statusColors = statusColorMap(colors);

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(`/recruiter/tracking/jobseeker/`);
                setHistory(res.data);
            } catch (err) {
                setError("Failed to load interview history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleViewMore = async (jobId) => {
        if (!jobId) return;
        setDetailsLoading(true);
        setOpenDetailsDialog(true);
        try {
            const response = await api.get(`/job-postings/${jobId}/`);
            setSelectedJobDetails(response.data);
        } catch (err) {
            setError('Failed to fetch job details.');
            setOpenDetailsDialog(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!history.length) {
        return (
            <Typography sx={{ textAlign: 'center', py: 8, color: colors.grey[400] }}>
                No interview history found.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: colors.grey[100] }}>
                Application History
            </Typography>
            {history.map((item) => (
                <Card
                    key={item.recruitmentId}
                    sx={{
                        mb: 3,
                        backgroundColor: colors.primary[400],
                        borderLeft: `5px solid ${statusColors[item.status] || colors.grey[700]}`,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.grey[100] }}>
                                    {item.job_post_title || item.companyName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: colors.grey[300] }}>
                                    <Business fontSize="small" />
                                    <Typography variant="body2">{item.companyName}</Typography>
                                </Box>
                                {item.job_post_location && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: colors.grey[300] }}>
                                        <LocationOn fontSize="small" />
                                        <Typography variant="body2">{item.job_post_location}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: colors.grey[400] }}>
                                    <Event fontSize="small" />
                                    <Typography variant="caption">Applied on: {new Date(item.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={item.status_display}
                                sx={{
                                    backgroundColor: statusColors[item.status] || colors.grey[700],
                                    color: item.status === 'applied' ? colors.grey[100] : colors.grey[900],
                                    fontWeight: "bold",
                                }}
                            />
                        </Box>
                        <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                {item.notes && (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: colors.grey[300] }}>
                                        "{item.notes}"
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    {item.githubUrl && (
                                        <MuiLink href={item.githubUrl} target="_blank" rel="noopener" sx={{ color: colors.blueAccent[300] }}>
                                            GitHub
                                        </MuiLink>
                                    )}
                                    {item.linkedinUrl && (
                                        <MuiLink href={item.linkedinUrl} target="_blank" rel="noopener" sx={{ color: colors.blueAccent[300] }}>
                                            LinkedIn
                                        </MuiLink>
                                    )}
                                </Box>
                            </Box>
                            {item.job_post_id && (
                                <Button variant="outlined" color="secondary" onClick={() => handleViewMore(item.job_post_id)}>
                                    View Job Details
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            ))}
            <JobDetailsDialog
                open={openDetailsDialog}
                onClose={() => setOpenDetailsDialog(false)}
                jobDetails={selectedJobDetails}
                loading={detailsLoading}
            />
        </Box>
    );
};

export default InterviewHistory;
