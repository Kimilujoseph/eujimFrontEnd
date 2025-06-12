import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    useTheme,
    Modal,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { tokens } from '../../theme';
import { CompanyRegistration } from '../../components/employer/companyRegistration';
import { DocumentsManager } from '../../components/employer/documentUpload';
import Header from '../../components/Header';
import { useAuth } from '../../auth/authContext';
import api from '../../api/api';

const EmployerDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useAuth();

    const [companyData, setCompanyData] = useState(null);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Check if company profile exists
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const response = await api.get(`/recruiter/profile/${user.id}`);
                setCompanyData(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setCompanyData(null);
                } else {
                    setSnackbar({
                        open: true,
                        message: 'Failed to load company profile',
                        severity: 'error'
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [user.id]);

    const handleCompleteRegistration = (data) => {
        setCompanyData(data);
        setRegistrationModalOpen(false);
        setSnackbar({
            open: true,
            message: 'Company registration completed!',
            severity: 'success'
        });
    };

    const handleOpenDocuments = () => {
        if (!companyData) {
            setSnackbar({
                open: true,
                message: 'Please register your company first',
                severity: 'error'
            });
            return;
        }
        setDocumentsModalOpen(true);
    };

    return (
        <Box m="20px">
            <Header
                title="EMPLOYER DASHBOARD"
                subtitle="Manage your recruitment activities"
            />

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <Box mt={3}>
                    <Box display="flex" gap={3} flexWrap="wrap">
                        {/* Company Profile Card */}
                        <Card sx={{
                            flex: 1,
                            minWidth: 300,
                            backgroundColor: colors.primary[400],
                            boxShadow: 'none',
                            border: `1px solid ${colors.grey[700]}`
                        }}>
                            <CardContent>
                                <Typography variant="h5" color={colors.grey[100]} mb={2}>
                                    Company Profile
                                </Typography>

                                {companyData ? (
                                    <Box>
                                        <Typography variant="h6" color={colors.greenAccent[500]}>
                                            {companyData.companyName}
                                        </Typography>
                                        <Typography variant="body1" color={colors.grey[300]} mt={1}>
                                            <strong>Industry:</strong> {companyData.industry}
                                        </Typography>
                                        <Typography variant="body1" color={colors.grey[300]}>
                                            <strong>Contact:</strong> {companyData.contactInfo}
                                        </Typography>
                                        <Typography variant="body1" color={colors.grey[300]}>
                                            <strong>Email:</strong> {companyData.companyEmail}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setRegistrationModalOpen(true)}
                                            sx={{
                                                mt: 2,
                                                color: colors.greenAccent[500],
                                                borderColor: colors.greenAccent[500],
                                                '&:hover': {
                                                    borderColor: colors.greenAccent[400],
                                                }
                                            }}
                                        >
                                            Update Profile
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={4}>
                                        <Typography variant="body1" color={colors.grey[400]} mb={3}>
                                            No company profile registered yet
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => setRegistrationModalOpen(true)}
                                            sx={{
                                                backgroundColor: colors.greenAccent[600],
                                                color: colors.grey[900],
                                                '&:hover': {
                                                    backgroundColor: colors.greenAccent[700],
                                                }
                                            }}
                                        >
                                            Register Company
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents Card */}
                        <Card sx={{
                            flex: 1,
                            minWidth: 300,
                            backgroundColor: colors.primary[400],
                            boxShadow: 'none',
                            border: `1px solid ${colors.grey[700]}`
                        }}>
                            <CardContent>
                                <Typography variant="h5" color={colors.grey[100]} mb={2}>
                                    Company Documents
                                </Typography>

                                <Typography variant="body1" color={colors.grey[300]} mb={3}>
                                    Upload and manage your company documents, certifications, and other files
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleOpenDocuments}
                                    disabled={!companyData}
                                    sx={{
                                        backgroundColor: colors.blueAccent[600],
                                        color: colors.grey[100],
                                        '&:hover': {
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                        '&:disabled': {
                                            backgroundColor: colors.grey[700],
                                            color: colors.grey[500]
                                        }
                                    }}
                                >
                                    Manage Documents
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            {/* Company Registration Modal */}
            <Modal
                open={registrationModalOpen}
                onClose={() => setRegistrationModalOpen(false)}
                aria-labelledby="company-registration-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)'
                }}
            >
                <Box
                    sx={{
                        width: '90%',
                        maxWidth: '800px',
                        backgroundColor: colors.primary[400],
                        borderRadius: '4px',
                        p: 4,
                        outline: 'none',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <CompanyRegistration
                        onComplete={handleCompleteRegistration}
                        onCancel={() => setRegistrationModalOpen(false)}
                    />
                </Box>
            </Modal>

            {/* Documents Management Modal */}
            <Modal
                open={documentsModalOpen}
                onClose={() => setDocumentsModalOpen(false)}
                aria-labelledby="documents-management-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)'
                }}
            >
                <Box
                    sx={{
                        width: '90%',
                        maxWidth: '1200px',
                        backgroundColor: colors.primary[400],
                        borderRadius: '4px',
                        p: 4,
                        outline: 'none',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <DocumentsManager
                        recruiterId={user.id}
                        onClose={() => setDocumentsModalOpen(false)}
                    />
                </Box>
            </Modal>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployerDashboard;