import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Card, CardContent, IconButton, TextField, Button, CircularProgress, Link as MuiLink, useTheme
} from '@mui/material';
import { Edit, Delete, Add, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import api from '../../../api/api';
import { tokens } from '../../../theme';

const CertificationForm = ({ formState, handleInputChange, handleCancel, handleSave, editingId, isSubmitting }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div className="p-6 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                {editingId ? 'Edit Certification' : 'Add New Certification'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="Issuer"
                    name="issuer"
                    value={formState.issuer}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Awarded Date"
                    name="awarded_date"
                    type="date"
                    value={formState.awarded_date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                />
                <div className="md:col-span-2">
                    <TextField
                        fullWidth
                        label="Certificate URL"
                        name="upload_path"
                        value={formState.upload_path}
                        onChange={handleInputChange}
                        placeholder="https://example.com/certificate.pdf"
                        variant="outlined"
                    />
                </div>
                <div className="md:col-span-2">
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={3}
                        value={formState.description}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3">
                    <Button onClick={handleCancel} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
};


const CertificationsSection = ({ showSnackbar, isReadOnly, jobSeekerId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formState, setFormState] = useState({
        issuer: '', awarded_date: '', upload_path: '', description: ''
    });

    const fetchCertifications = useCallback(async () => {
        setLoading(true);
        try {
            const url = isReadOnly ? `/graduate/certifications/${jobSeekerId}/` : '/graduate/certifications/';
            const response = await api.get(url);
            setCertifications(response.data);
        } catch (error) {
            showSnackbar('Error fetching certifications', 'error');
        } finally {
            setLoading(false);
        }
    }, [isReadOnly, jobSeekerId, showSnackbar]);

    useEffect(() => {
        fetchCertifications();
    }, [fetchCertifications]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/graduate/certifications/${editingId}/update/`, formState);
                showSnackbar('Certification updated successfully');
            } else {
                await api.post('/graduate/certifications/add/', formState);
                showSnackbar('Certification added successfully');
            }
            await fetchCertifications();
            handleCancel();
        } catch (error) {
            showSnackbar('Error saving certification', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (cert) => {
        setEditingId(cert.id);
        setFormState({
            issuer: cert.issuer,
            awarded_date: cert.awarded_date.split('T')[0], // Format for date input
            upload_path: cert.upload_path || '',
            description: cert.description
        });
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certification?')) return;
        try {
            await api.delete(`/graduate/certifications/${id}/delete/`);
            showSnackbar('Certification deleted successfully');
            await fetchCertifications();
        } catch (error) {
            showSnackbar('Error deleting certification', 'error');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormState({ issuer: '', awarded_date: '', upload_path: '', description: '' });
    };

    if (loading) {
        return <div className="flex justify-center p-8"><CircularProgress /></div>;
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h5" className="font-bold">Certifications</Typography>
                {!isReadOnly && !isAdding && editingId === null && (
                    <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)} sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
                        Add Certification
                    </Button>
                )}
            </div>

            {!isReadOnly && (isAdding || editingId !== null) && (
                <CertificationForm
                    formState={formState}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    editingId={editingId}
                    isSubmitting={isSubmitting}
                />
            )}

            <div className="space-y-4">
                {certifications.length > 0 ? certifications.map((cert) => (
                    editingId === cert.id ? null : (
                        <Card key={cert.id} sx={{ backgroundColor: colors.primary[400] }}>
                            <CardContent>
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <Typography variant="h6">{cert.issuer}</Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                            Awarded on: {new Date(cert.awarded_date).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body1" className="whitespace-pre-wrap mb-2">{cert.description}</Typography>
                                        {cert.upload_path && (
                                            <MuiLink href={cert.upload_path} target="_blank" rel="noopener" className="flex items-center gap-1 text-blue-400 hover:underline">
                                                <CloudUploadIcon fontSize="small" /> View Certificate
                                            </MuiLink>
                                        )}
                                    </div>
                                    {!isReadOnly && (
                                        <div className="flex-shrink-0 ml-2">
                                            <IconButton onClick={() => handleEdit(cert)}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDelete(cert.id)}><Delete /></IconButton>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                )) : (
                    <Typography className="text-gray-500">No certifications added yet.</Typography>
                )}
            </div>
        </div>
    );
};

export default CertificationsSection;
