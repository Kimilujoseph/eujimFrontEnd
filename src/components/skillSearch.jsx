import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Chip,
    Autocomplete,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    useTheme,
    CircularProgress,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { tokens } from '../theme';
import api from '../api/api';
import { Business, GitHub, LinkedIn, LocationOn } from '@mui/icons-material';
import { useAuth } from "../auth/authContext"
import { useNavigate } from "react-router-dom"
const SkillSearchComponent = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [proficiency, setProficiency] = useState('intermediate');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Common skills for autocomplete suggestions
    const skillSuggestions = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js',
        'MongoDB', 'SQL', 'Docker', 'AWS', 'TypeScript',
        'GraphQL', 'REST API', 'HTML', 'CSS', 'Redux'
    ];

    const proficiencyLevels = [
        { value: 'begginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'midlevel', label: 'Mid-Level' },
        { value: 'proffessional', label: 'Professional' }
    ];

    const handleSearch = async () => {
        if (selectedSkills.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please select at least one skill',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);
        setError(null);
        setSearchResults([]); // Clear previous results

        try {
            const skillsQuery = selectedSkills.join(',');
            const response = await api.get(
                `/search/jobseekers/?skills=${skillsQuery}&proficiency=${proficiency}`
            );

            // Handle empty results (200 with empty array)
            if (response.data.length === 0) {
                setSnackbar({
                    open: true,
                    message: 'No candidates found with these skill criteria',
                    severity: 'info'
                });
            } else {
                setSearchResults(response.data);
            }

        } catch (err) {

            if (err.response?.status === 404) {
                setSnackbar({
                    open: true,
                    message: err.response.data?.message || 'No users found with the specified criteria.',
                    severity: 'info'
                });
            }
            // Handle other errors
            else {
                setError(err.message);
                setSnackbar({
                    open: true,
                    message: err.response?.data?.message || 'Failed to search candidates',
                    severity: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewAnalytics = (candidateId, name) => {
        navigate(`/job-seeker-dashboard/employer-view/${candidateId}/${name}`);
    };

    const handleAddCandidate = async (candidateId, notes = '') => {
        try {
            console.log("candidate key", candidateId)
            await api.post('/recruiter/tracking/', {
                job_seeker_id: candidateId,
                notes: notes || `Interested in ${selectedSkills.join(', ')} skills`
            });
            setSnackbar({
                open: true,
                message: 'Candidate added to recruitment pipeline',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to add candidate',
                severity: 'error'
            });
        }
    };

    const handleUpdateStatus = async (trackingId, status) => {
        try {
            await api.patch(`/recruiter/tracking/manage/${trackingId}/`, { status });
            setSnackbar({
                open: true,
                message: 'Candidate status updated',
                severity: 'success'
            });
            // Refresh data if needed
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to update status',
                severity: 'error'
            });
        }
    };

    const handleMenuClick = (event, candidate) => {
        setAnchorEl(event.currentTarget);
        setSelectedCandidate(candidate);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCandidate(null);
    };

    return (
        <Box m="20px">
            <Typography variant="h4" color={colors.grey[100]} mb={2}>
                Find Candidates by Skills
            </Typography>

            <Box display="flex" gap={2} mb={4} flexWrap="wrap">
                <Autocomplete
                    multiple
                    freeSolo
                    options={skillSuggestions}
                    value={selectedSkills}
                    onChange={(event, newValue) => {
                        setSelectedSkills(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Search skills"
                            placeholder="e.g. JavaScript, React"
                            sx={{
                                flex: 1,
                                minWidth: 300,
                                '& .MuiFilledInput-root': {
                                    backgroundColor: colors.primary[400],
                                },
                                '& .MuiInputLabel-root': {
                                    color: colors.grey[300],
                                },
                            }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={option}
                                label={option}
                                sx={{
                                    backgroundColor: colors.blueAccent[500],
                                    color: colors.grey[100],
                                    margin: '4px'
                                }}
                            />
                        ))
                    }
                />

                <FormControl variant="filled" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: colors.grey[300] }}>Proficiency Level</InputLabel>
                    <Select
                        value={proficiency}
                        onChange={(e) => setProficiency(e.target.value)}
                        sx={{
                            backgroundColor: colors.primary[400],
                            color: colors.grey[100],
                            '& .MuiSelect-icon': {
                                color: colors.grey[300]
                            }
                        }}
                    >
                        {proficiencyLevels.map((level) => (
                            <MenuItem key={level.value} value={level.value}>
                                {level.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[900],
                        '&:hover': {
                            backgroundColor: colors.greenAccent[700],
                        },
                        height: '56px',
                        minWidth: '150px'
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress color="secondary" />
                </Box>
            )}

            {searchResults.length > 0 && (
                <Box>
                    <Typography variant="h5" color={colors.grey[100]} mb={2}>
                        {searchResults.length} Candidates Found
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={3}>
                        {searchResults.map((candidate) => (
                            <Card key={candidate.id} sx={{
                                backgroundColor: colors.primary[400],
                                border: `1px solid ${colors.grey[700]}`
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{
                                                width: 60,
                                                height: 60,
                                                backgroundColor: colors.greenAccent[500],
                                                fontSize: '1.5rem'
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

                                        <Button
                                            variant="contained"
                                            onClick={(e) => handleMenuClick(e, candidate)}
                                            sx={{
                                                backgroundColor: colors.blueAccent[600],
                                                color: colors.grey[100],
                                                '&:hover': {
                                                    backgroundColor: colors.blueAccent[700],
                                                }
                                            }}
                                        >
                                            Actions
                                        </Button>
                                    </Box>

                                    <Box mt={3} display="flex" flexWrap="wrap" gap={1}>
                                        {candidate.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={`${skill.skill_name} (${skill.proffeciency_level})`}
                                                sx={{
                                                    backgroundColor: colors.blueAccent[700],
                                                    color: colors.grey[100]
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    {candidate.profile && (
                                        <Box mt={3}>
                                            <Typography variant="body1" color={colors.grey[300]}>
                                                <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                                                {candidate.profile.location || 'Location not specified'}
                                            </Typography>

                                            {candidate.profile.about && (
                                                <Typography variant="body1" color={colors.grey[300]} mt={2}>
                                                    {candidate.profile.about}
                                                </Typography>
                                            )}

                                            <Box mt={2} display="flex" gap={2}>
                                                {candidate.profile.github_url && (
                                                    <Button
                                                        variant="outlined"
                                                        href={candidate.profile.github_url}
                                                        target="_blank"
                                                        startIcon={<GitHub />}
                                                        sx={{
                                                            color: colors.grey[100],
                                                            borderColor: colors.grey[500],
                                                            '&:hover': {
                                                                borderColor: colors.grey[400],
                                                            }
                                                        }}
                                                    >
                                                        GitHub
                                                    </Button>
                                                )}

                                                {candidate.profile.linkedin_url && (
                                                    <Button
                                                        variant="outlined"
                                                        href={candidate.profile.linkedin_url}
                                                        target="_blank"
                                                        startIcon={<LinkedIn />}
                                                        sx={{
                                                            color: colors.grey[100],
                                                            borderColor: colors.grey[500],
                                                            '&:hover': {
                                                                borderColor: colors.grey[400],
                                                            }
                                                        }}
                                                    >
                                                        LinkedIn
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleAddCandidate(selectedCandidate.profile.job_seeker_id);
                    handleMenuClose();
                }}>
                    Add to Pipeline
                </MenuItem>
                <MenuItem onClick={() => {
                    handleViewAnalytics(selectedCandidate.id, selectedCandidate.firstName);
                    handleMenuClose();
                }}>
                    View Skills
                </MenuItem>
            </Menu>

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

export default SkillSearchComponent;