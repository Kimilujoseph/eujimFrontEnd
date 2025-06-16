import { useState, useEffect, useContext } from 'react';
import {
    Button,
    Modal,
    CircularProgress,
    Snackbar,
    Alert,
    useTheme
} from '@mui/material';
import { CompanyRegistration } from '../../components/employer/companyRegistration';
import { DocumentsManager } from '../../components/employer/documentUpload';
import Header from '../../components/Header';
import { useAuth } from '../../auth/authContext';
import api from '../../api/api';
import {
    Edit as EditIcon,
    Business as BusinessIcon,
    Description as DocumentsIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { tokens } from '../../theme';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [userEditModalOpen, setUserEditModalOpen] = useState(false);
    const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

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
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                await fetchCompanyProfile();
                setUserData({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user.id, user.email, user.firstName, user.lastName]);

    const handleCompanyUpdate = async (data) => {
        try {
            if (companyData) {
                await api.put(`/recruiter/profile/${user.id}`, data);
                setSnackbar({
                    open: true,
                    message: 'Company updated successfully!',
                    severity: 'success'
                });
            } else {
                await api.post('/recruiter/register', {
                    ...data,
                    userId: user.id
                });
                setSnackbar({
                    open: true,
                    message: 'Company registered successfully!',
                    severity: 'success'
                });
            }
            await fetchCompanyProfile();
            setRegistrationModalOpen(false);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message ||
                    (companyData ? 'Update failed' : 'Registration failed'),
                severity: 'error'
            });
        }
    };

    const handleUpdateUserProfile = async (updatedData) => {
        try {
            await api.put(`/api/v1/recruiter/profile/${user.id}`, updatedData);
            setUserData(updatedData);
            setUserEditModalOpen(false);
            setSnackbar({
                open: true,
                message: 'Personal information updated successfully!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to update personal information',
                severity: 'error'
            });
        }
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

    const handleCloseModal = () => {
        setRegistrationModalOpen(false);
        setUserEditModalOpen(false);
        setDocumentsModalOpen(false);
    };

    return (
        <div className="p-6">
            <Header
                title="EMPLOYER PROFILE"
                subtitle="Manage your recruitment activities"
            />

            {loading ? (
                <div className="flex justify-center mt-8">
                    <CircularProgress color="secondary" />
                </div>
            ) : (
                <div className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <div 
                            className="rounded-lg shadow-md p-6"
                            style={{ 
                                backgroundColor: colors.primary[400],
                                border: `1px solid ${colors.grey[700]}`
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 
                                    className="text-xl font-semibold flex items-center"
                                    style={{ color: colors.grey[100] }}
                                >
                                    <PersonIcon className="mr-2" />
                                    Personal Profile
                                </h2>
                                <button
                                    onClick={() => setUserEditModalOpen(true)}
                                    style={{ color: colors.blueAccent[500] }}
                                    className="hover:opacity-80"
                                >
                                    <EditIcon />
                                </button>
                            </div>

                            {userData && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Name</p>
                                        <p style={{ color: colors.grey[100] }}>
                                            {userData.firstName} {userData.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Email</p>
                                        <p style={{ color: colors.grey[100] }}>{userData.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Profile Card */}
                        <div 
                            className="rounded-lg shadow-md p-6 lg:col-span-2"
                            style={{ 
                                backgroundColor: colors.primary[400],
                                border: `1px solid ${colors.grey[700]}`
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 
                                    className="text-xl font-semibold flex items-center"
                                    style={{ color: colors.grey[100] }}
                                >
                                    <BusinessIcon className="mr-2" />
                                    Company Profile
                                </h2>
                                {companyData && (
                                    <button
                                        onClick={() => setRegistrationModalOpen(true)}
                                        style={{ color: colors.blueAccent[500] }}
                                        className="hover:opacity-80"
                                    >
                                        <EditIcon />
                                    </button>
                                )}
                            </div>

                            {companyData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Company Name</p>
                                        <p className="font-medium" style={{ color: colors.grey[100] }}>
                                            {companyData.companyName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Industry</p>
                                        <p style={{ color: colors.grey[100] }}>{companyData.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Contact</p>
                                        <p style={{ color: colors.grey[100] }}>{companyData.contactInfo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Company Email</p>
                                        <p style={{ color: colors.grey[100] }}>{companyData.companyEmail}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm" style={{ color: colors.grey[300] }}>Description</p>
                                        <p style={{ color: colors.grey[100] }}>{companyData.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p style={{ color: colors.grey[300], marginBottom: '1rem' }}>
                                        No company profile registered yet
                                    </p>
                                    <button
                                        onClick={() => setRegistrationModalOpen(true)}
                                        style={{ 
                                            backgroundColor: colors.greenAccent[500],
                                            color: colors.grey[100]
                                        }}
                                        className="px-4 py-2 rounded-md transition-colors hover:opacity-90"
                                    >
                                        Register Company
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Documents Card */}
                        <div 
                            className="rounded-lg shadow-md p-6 lg:col-span-3"
                            style={{ 
                                backgroundColor: colors.primary[400],
                                border: `1px solid ${colors.grey[700]}`
                            }}
                        >
                            <div className="flex items-center mb-4">
                                <DocumentsIcon className="mr-2" style={{ color: colors.grey[300] }} />
                                <h2 className="text-xl font-semibold" style={{ color: colors.grey[100] }}>
                                    Company Documents
                                </h2>
                            </div>

                            <p style={{ color: colors.grey[300], marginBottom: '1rem' }}>
                                Upload and manage your company documents, certifications, and other files
                            </p>

                            <button
                                onClick={handleOpenDocuments}
                                disabled={!companyData}
                                style={{
                                    backgroundColor: companyData ? colors.blueAccent[500] : colors.grey[700],
                                    color: colors.grey[100],
                                    opacity: companyData ? 1 : 0.7
                                }}
                                className="px-4 py-2 rounded-md transition-colors hover:opacity-90"
                            >
                                Manage Documents
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Registration/Edit Modal */}
            <Modal
                open={registrationModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="company-registration-modal"
            >
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div 
                        className="w-full max-w-4xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: colors.primary[400] }}
                    >
                        <CompanyRegistration
                            initialData={companyData}
                            onComplete={handleCompanyUpdate}
                            onCancel={handleCloseModal}
                            isUpdate={!!companyData}
                        />
                    </div>
                </div>
            </Modal>

            {/* User Edit Modal */}
            <Modal
                open={userEditModalOpen}
                onClose={() => setUserEditModalOpen(false)}
                aria-labelledby="user-edit-modal"
            >
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div 
                        className="w-full max-w-md rounded-lg shadow-xl p-6"
                        style={{ backgroundColor: colors.primary[400] }}
                    >
                        <h2 
                            className="text-xl font-semibold mb-4"
                            style={{ color: colors.grey[100] }}
                        >
                            Edit Personal Information
                        </h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleUpdateUserProfile({
                                firstName: formData.get('firstName'),
                                lastName: formData.get('lastName'),
                                email: formData.get('email')
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label 
                                        className="block text-sm font-medium mb-1"
                                        style={{ color: colors.grey[300] }}
                                    >
                                        First Name
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        defaultValue={userData?.firstName}
                                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                                        style={{ 
                                            backgroundColor: colors.primary[500],
                                            borderColor: colors.grey[700],
                                            color: colors.grey[100]
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label 
                                        className="block text-sm font-medium mb-1"
                                        style={{ color: colors.grey[300] }}
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        defaultValue={userData?.lastName}
                                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                                        style={{ 
                                            backgroundColor: colors.primary[500],
                                            borderColor: colors.grey[700],
                                            color: colors.grey[100]
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label 
                                        className="block text-sm font-medium mb-1"
                                        style={{ color: colors.grey[300] }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={userData?.email}
                                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                                        style={{ 
                                            backgroundColor: colors.primary[500],
                                            borderColor: colors.grey[700],
                                            color: colors.grey[100]
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setUserEditModalOpen(false)}
                                        className="px-4 py-2 rounded-md"
                                        style={{ 
                                            borderColor: colors.grey[700],
                                            color: colors.grey[100],
                                            backgroundColor: colors.primary[500]
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-md text-white"
                                        style={{ backgroundColor: colors.blueAccent[500] }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Documents Management Modal */}
            <Modal
                open={documentsModalOpen}
                onClose={() => setDocumentsModalOpen(false)}
                aria-labelledby="documents-management-modal"
            >
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div 
                        className="w-full max-w-6xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: colors.primary[400] }}
                    >
                        <DocumentsManager
                            recruiterId={user.id}
                            onClose={() => setDocumentsModalOpen(false)}
                        />
                    </div>
                </div>
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
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EmployerDashboard;