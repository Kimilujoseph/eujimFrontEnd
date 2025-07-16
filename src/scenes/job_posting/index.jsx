import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import api from '../../api/api';
import { useAuth } from '../../auth/authContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const JobPostingManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [applicantsError, setApplicantsError] = useState(null);
    const [openApplicantsDialog, setOpenApplicantsDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        location: '',
        job_type: 'full_time',
        experience_level: 'mid',
        salary_range_min: '',
        salary_range_max: '',
        application_deadline: ''
    });

    const fetchJobPostings = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await api.get(`/recruiter-job-postings/`);
            if (response.status === 404) {
                setError('no job posting found')
            }
            setJobPostings(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch job postings.');
            setJobPostings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobPostings();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedJob) {
                await api.put(`/job-postings/${selectedJob.id}/`, formData);
            } else {
                await api.post('/job-postings/create/', formData);
            }
            resetForm();
            fetchJobPostings();
            setOpenDialog(false);
        } catch (err) {
            setError('Failed to create/update job posting.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            requirements: '',
            responsibilities: '',
            location: '',
            job_type: 'full_time',
            experience_level: 'mid',
            salary_range_min: '',
            salary_range_max: '',
            application_deadline: ''
        });
        setIsEditing(false);
        setSelectedJob(null);
    };

    const handleEdit = async (job) => {
        try {
            const response = await api.get(`/job-postings/${job.id}/`);
            const jobDetails = response.data;
            setSelectedJob(jobDetails);
            setIsEditing(true);
            setFormData({
                title: jobDetails.title,
                description: jobDetails.description,
                requirements: jobDetails.requirements,
                responsibilities: jobDetails.responsibilities,
                location: jobDetails.location,
                job_type: jobDetails.job_type,
                experience_level: jobDetails.experience_level,
                salary_range_min: jobDetails.salary_range_min,
                salary_range_max: jobDetails.salary_range_max,
                application_deadline: jobDetails.application_deadline
            });
            setOpenDialog(true);
        } catch (err) {
            setError('Failed to fetch job details.');
        }
    };

    const handleAddSkill = async () => {
        if (!selectedJob || !newSkill) return;
        try {
            await api.post(`/job-postings/add-skills/${selectedJob.id}/`, {
                skill_name: newSkill
            });
            fetchJobPostings();
            setNewSkill('');
        } catch (err) {
            setError('Failed to add skill.');
        }
    };

    const handleDeleteSkill = async (skillId) => {
        if (!selectedJob || !skillId) return;
        try {
            await api.delete(`/job-postings/${selectedJob.id}/delete-skill/${skillId}/`);
            fetchJobPostings();

        } catch (err) {
            setError('Failed to delete skill.');
        }
    };

    const handleDelete = async () => {
        if (!selectedJob) return;
        try {
            await api.delete(`/job-postings/${selectedJob.id}/`);
            setOpenDeleteDialog(false);
            fetchJobPostings();
        } catch (err) {
            setError('Failed to delete job posting.');
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            setApplicantsError(null);
            setApplicants([]);
            const response = await api.get(`/recruiter/job-postings/${jobId}/applicants/`);
            if (response.data && Array.isArray(response.data.applicants) && response.data.applicants.length > 0) {
                setApplicants(response.data.applicants);
            }
        } catch (err) {
            setApplicants([]);
            if (err.response) {
                if (err.response.status === 404) {
                    // Not an error, just no applicants. The dialog will handle the empty array.
                } else if (err.response.status >= 500) {
                    setApplicantsError("An internal server error occurred. Please try again later.");
                } else {
                    setApplicantsError(`An error occurred while fetching applicants: ${err.response.statusText}`);
                }
            } else {
                setApplicantsError("A network error occurred. Please check your connection.");
            }
        } finally {
            setOpenApplicantsDialog(true);
        }
    };

    return (
        <Box m="20px">
            <Header title="Job Posting Management" subtitle="Create and manage job postings" />

            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    resetForm();
                    setOpenDialog(true);
                }}
                sx={{ marginBottom: '20px' }}
            >
                Create New Job Posting
            </Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>{isEditing ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'grid',
                            gap: '20px',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            padding: '20px 0'
                        }}
                    >
                        <TextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ gridColumn: 'span 2' }}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ gridColumn: 'span 2' }}
                        />
                        <TextField
                            name="requirements"
                            label="Requirements"
                            value={formData.requirements}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ gridColumn: 'span 2' }}
                        />
                        <TextField
                            name="responsibilities"
                            label="Responsibilities"
                            value={formData.responsibilities}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ gridColumn: 'span 2' }}
                        />
                        <TextField
                            name="location"
                            label="Location"
                            value={formData.location}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Job Type</InputLabel>
                            <Select
                                name="job_type"
                                value={formData.job_type}
                                onChange={handleInputChange}
                                label="Job Type"
                            >
                                <MenuItem value="full_time">Full Time</MenuItem>
                                <MenuItem value="part_time">Part Time</MenuItem>
                                <MenuItem value="contract">Contract</MenuItem>
                                <MenuItem value="internship">Internship</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Experience Level</InputLabel>
                            <Select
                                name="experience_level"
                                value={formData.experience_level}
                                onChange={handleInputChange}
                                label="Experience Level"
                            >
                                <MenuItem value="entry">Entry Level</MenuItem>
                                <MenuItem value="mid">Mid Level</MenuItem>
                                <MenuItem value="senior">Senior Level</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="salary_range_min"
                            label="Minimum Salary"
                            type="number"
                            value={formData.salary_range_min}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="salary_range_max"
                            label="Maximum Salary"
                            type="number"
                            value={formData.salary_range_max}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="application_deadline"
                            label="Application Deadline"
                            type="date"
                            value={formData.application_deadline}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{ gridColumn: 'span 2' }}
                        />
                    </Box>
                    {selectedJob && (
                        <Box sx={{ marginTop: '20px' }}>
                            <Typography variant="h6">Skills</Typography>
                            <Box sx={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                                <TextField
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    label="Add Skill"
                                    size="small"
                                />
                                <Button onClick={handleAddSkill} variant="contained">
                                    Add Skill
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {selectedJob.required_skills?.map((skill) => (
                                    <Chip
                                        key={skill.id}
                                        label={skill.skill_name}
                                        onDelete={() => handleDeleteSkill(skill.skill_id)}
                                        deleteIcon={<DeleteIcon />}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="secondary">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openApplicantsDialog} onClose={() => setOpenApplicantsDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
                <DialogContent>
                    {applicantsError ? (
                        <Typography color="error" sx={{ textAlign: 'center', padding: 2 }}>
                            {applicantsError}
                        </Typography>
                    ) : applicants.length === 0 ? (
                        <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
                            No applicants found for this job posting.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {applicants.map((applicant) => (
                                <Card key={applicant.recruitmentId} sx={{ backgroundColor: colors.primary[400], mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {applicant.firstName} {applicant.lastName}
                                        </Typography>

                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="subtitle2">Company:</Typography>
                                            <Typography>{applicant.companyName}</Typography>
                                            <Typography color="text.secondary">{applicant.companyInfo}</Typography>
                                        </Box>

                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="subtitle2">Status:</Typography>
                                            <Chip
                                                label={applicant.status_display}
                                                sx={{ margin: '5px 0' }}
                                                color={
                                                    applicant.status === 'approved' ? 'success' :
                                                        applicant.status === 'rejected' ? 'error' :
                                                            'primary'
                                                }
                                            />
                                        </Box>

                                        {applicant.notes && (
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2">Notes:</Typography>
                                                <Typography>{applicant.notes}</Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            {applicant.linkedinUrl && (
                                                <Button
                                                    href={applicant.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    LinkedIn
                                                </Button>
                                            )}
                                            {applicant.githubUrl && (
                                                <Button
                                                    href={applicant.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    GitHub
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApplicantsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this job posting?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="secondary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h4" color={colors.grey[100]} sx={{ marginBottom: '20px' }}>
                Existing Job Postings
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Box sx={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {Array.isArray(jobPostings) && jobPostings.map((job) => (
                        <Card key={job.id} sx={{ backgroundColor: colors.primary[400] }}>
                            <CardContent>
                                <Typography variant="h5">{job.title}</Typography>
                                <Typography color="text.secondary">{job.location}</Typography>
                                <Chip label={job.job_type} sx={{ margin: '10px 0' }} />
                                <Typography>
                                    ${job.salary_range_min} - ${job.salary_range_max}
                                </Typography>
                                <Box sx={{ marginTop: '10px' }}>
                                    <Typography variant="subtitle2">Skills:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {job.required_skills?.map((skill) => (
                                            <Chip key={skill.id} label={skill.skill_name} size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => {
                                    setSelectedJob(job);
                                    fetchApplicants(job.id);
                                }}>
                                    View Applicants
                                </Button>
                                <Button size="small" onClick={() => handleEdit(job)} startIcon={<EditIcon />}>
                                    Edit
                                </Button>
                                <Button size="small" onClick={() => {
                                    setSelectedJob(job);
                                    setOpenDeleteDialog(true);
                                }} startIcon={<DeleteIcon />}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default JobPostingManagement;