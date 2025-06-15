import { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    CircularProgress,
    Snackbar,
    Alert
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

const EmployerDashboard = () => {
    const { user } = useAuth();

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
                // Update existing company
                await api.put(`/recruiter/profile/${user.id}`, data);
                setSnackbar({
                    open: true,
                    message: 'Company updated successfully!',
                    severity: 'success'
                });
            } else {
                // Create new company
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
            await fetchCompanyProfile(); // Refresh company data
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

    const handleCloseModal = () => {
        setRegistrationModalOpen(false);
        setUserEditModalOpen(false);
        setDocumentsModalOpen(false);
    };

    return (
        <div className="p-6">
            <Header
                title="EMPLOYER DASHBOARD"
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
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                                    <PersonIcon className="mr-2" />
                                    Personal Profile
                                </h2>
                                <button
                                    onClick={() => setUserEditModalOpen(true)}
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <EditIcon />
                                </button>
                            </div>

                            {userData && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {userData.firstName} {userData.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-gray-800 dark:text-gray-200">{userData.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Profile Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                                    <BusinessIcon className="mr-2" />
                                    Company Profile
                                </h2>
                                {companyData && (
                                    <button
                                        onClick={() => setRegistrationModalOpen(true)}
                                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <EditIcon />
                                    </button>
                                )}
                            </div>

                            {companyData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                                            {companyData.companyName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                                        <p className="text-gray-800 dark:text-gray-200">{companyData.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                                        <p className="text-gray-800 dark:text-gray-200">{companyData.contactInfo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Company Email</p>
                                        <p className="text-gray-800 dark:text-gray-200">{companyData.companyEmail}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                        <p className="text-gray-800 dark:text-gray-200">{companyData.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        No company profile registered yet
                                    </p>
                                    <button
                                        onClick={() => setRegistrationModalOpen(true)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                    >
                                        Register Company
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 lg:col-span-3">
                            <div className="flex items-center mb-4">
                                <DocumentsIcon className="mr-2 text-gray-700 dark:text-gray-300" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                    Company Documents
                                </h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Upload and manage your company documents, certifications, and other files
                            </p>

                            <button
                                onClick={handleOpenDocuments}
                                disabled={!companyData}
                                className={`px-4 py-2 rounded-md transition-colors ${companyData
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
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
                    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
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
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        defaultValue={userData?.firstName}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        defaultValue={userData?.lastName}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={userData?.email}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setUserEditModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
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
                    <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
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
                    className="w-full"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EmployerDashboard;