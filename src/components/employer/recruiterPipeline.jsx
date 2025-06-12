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
    CircularProgress
} from '@mui/material';
import { tokens } from '../../theme';
import api from '../../api/api';
import { useAuth } from "../../auth/authContext"

const RecruitmentPipeline = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();

    const [tabValue, setTabValue] = useState(0);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/v1/recruiter/tracking/');
                setCandidates(response.data);
            } catch (err) {
                console.error('Failed to fetch candidates', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);
    const handleUpdateStatus = async () => {

    }
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
                                <Card key={candidate.id} sx={{
                                    backgroundColor: colors.primary[400],
                                    borderLeft: `4px solid ${statusColors[candidate.status] || colors.grey[700]}`
                                }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{
                                                    width: 60,
                                                    height: 60,
                                                    backgroundColor: colors.blueAccent[500]
                                                }}>
                                                    {candidate.firstName.charAt(0)}{candidate.lastName?.charAt(0) || ''}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h5" color={colors.grey[100]}>
                                                        {candidate.firstName} {candidate.lastName}
                                                    </Typography>
                                                    <Typography variant="body2" color={colors.greenAccent[500]}>
                                                        {candidate.email}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Chip
                                                label={candidate.status}
                                                sx={{
                                                    backgroundColor: statusColors[candidate.status],
                                                    color: colors.grey[900],
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize'
                                                }}
                                            />
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
                                                color="primary"
                                                onClick={() => handleUpdateStatus(candidate.id, 'interviewed')}
                                            >
                                                Interview
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleUpdateStatus(candidate.id, 'hired')}
                                            >
                                                Hire
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleUpdateStatus(candidate.id, 'rejected')}
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
        </Box>
    );
};

export default RecruitmentPipeline;