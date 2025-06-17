import { useState, useEffect, useCallback } from "react";
import {
    Button,
    LinearProgress,
    Snackbar,
    Alert,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import api from "../../api/api";
import { CloudUpload, Delete, Download, Close } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import { useAuth } from "../../auth/authContext";

export const DocumentsManager = ({ recruiterId, onClose }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info"
    });
    const { user } = useAuth();

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = user?.role === 'admin'
                ? `/admin/documents/${recruiterId}`
                : `/recruiter/documents/upload/${user?.id || recruiterId}`;

            const response = await api.get(endpoint);
            setDocuments(response.data);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Failed to load documents",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    }, [user?.id, recruiterId, user?.role]);

    const handleUpload = async (files) => {
        setUploading(true);
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("upload_path", file);
                formData.append("doc_type", "registration certificate");

                const endpoint = user?.role === 'admin'
                    ? `/admin/documents/${recruiterId}`
                    : "/recruiter/documents/upload/";

                await api.post(endpoint, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            setSnackbar({
                open: true,
                message: "Documents uploaded successfully!",
                severity: "success"
            });
            fetchDocuments();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Upload failed",
                severity: "error"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        try {
            const endpoint = user?.role === 'admin'
                ? `/admin/documents/${docId}`
                : `/recruiter/documents/upload/${docId}/`;

            await api.delete(endpoint);
            setSnackbar({
                open: true,
                message: "Document deleted successfully",
                severity: "success"
            });
            fetchDocuments();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Delete failed",
                severity: "error"
            });
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const getFileName = (url) => {
        if (!url) return "Unknown";
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div style={{
            backgroundColor: colors.primary[400],
            border: `1px solid ${colors.grey[700]}`,
            borderRadius: '8px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative'
        }}>
            {/* Header with close button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: `1px solid ${colors.grey[700]}`
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: colors.grey[100]
                }}>
                    {user?.role === 'admin' ? 'Manage Company Documents' : 'Company Documents'}
                </h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.grey[300],
                        cursor: 'pointer',
                        '&:hover': {
                            color: colors.grey[100]
                        }
                    }}
                >
                    <Close />
                </button>
            </div>

            <div style={{ padding: '16px' }}>
                {loading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Dropzone
                            onDrop={handleUpload}
                            accept={{
                                "image/*": [],
                                "application/pdf": [".pdf"],
                                "application/msword": [".doc"],
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
                            }}
                            maxFiles={5}
                            disabled={uploading}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                    style={{
                                        padding: '24px',
                                        border: `2px dashed ${colors.grey[600]}`,
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        backgroundColor: colors.primary[500],
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        transition: 'border-color 0.3s ease',
                                        opacity: uploading ? 0.7 : 1,
                                        '&:hover': {
                                            borderColor: colors.greenAccent[500]
                                        }
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUpload style={{
                                        fontSize: '2.5rem',
                                        color: colors.grey[300],
                                        marginBottom: '8px'
                                    }} />
                                    <p style={{ color: colors.grey[100], margin: 0 }}>
                                        Drag & drop files here, or click to select
                                    </p>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: colors.grey[300],
                                        marginTop: '4px',
                                        marginBottom: 0
                                    }}>
                                        (Accepted: images, PDFs, Word docs, max 5 files)
                                    </p>
                                    {uploading && (
                                        <LinearProgress style={{ marginTop: '12px' }} />
                                    )}
                                </div>
                            )}
                        </Dropzone>

                        <div style={{ marginTop: '16px' }}>
                            {documents.length === 0 ? (
                                <p style={{
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    color: colors.grey[300]
                                }}>
                                    No documents uploaded yet
                                </p>
                            ) : (
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    '& > li + li': {
                                        marginTop: '8px'
                                    }
                                }}>
                                    {documents.map((doc) => (
                                        <li
                                            key={doc.id || doc.upload_path}
                                            style={{
                                                backgroundColor: colors.primary[500],
                                                padding: '12px',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: colors.primary[600]
                                                },
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{
                                                    margin: 0,
                                                    color: colors.grey[100],
                                                    fontWeight: 500,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {getFileName(doc.upload_path)}
                                                </p>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0 16px',
                                                    fontSize: '0.875rem',
                                                    color: colors.grey[300]
                                                }}>
                                                    <span>
                                                        {doc.createdAt && new Date(doc.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span>{doc.doc_type}</span>
                                                    <span style={{
                                                        color: doc.status === 'approved' ? colors.greenAccent[500] :
                                                            doc.status === 'rejected' ? colors.redAccent[500] :
                                                            colors.yellowAccent[500]
                                                    }}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <a
                                                    href={user?.role === 'admin'
                                                        ? `/admin/documents/${doc.id}/download`
                                                        : `/recruiter/documents/${doc.id}/download/`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: colors.greenAccent[500],
                                                        padding: '4px',
                                                        '&:hover': {
                                                            color: colors.greenAccent[400]
                                                        }
                                                    }}
                                                >
                                                    <Download />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: colors.redAccent[500],
                                                        padding: '4px',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            color: colors.redAccent[400]
                                                        }
                                                    }}
                                                >
                                                    <Delete />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Status actions for admin */}
            {user?.role === 'admin' && documents.length > 0 && (
                <div style={{
                    padding: '16px',
                    borderTop: `1px solid ${colors.grey[700]}`,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={() => handleBulkStatusUpdate('approved')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: colors.greenAccent[600],
                            color: colors.grey[900],
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: colors.greenAccent[700]
                            }
                        }}
                    >
                        Approve All
                    </button>
                    <button
                        onClick={() => handleBulkStatusUpdate('rejected')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: colors.redAccent[600],
                            color: colors.grey[100],
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: colors.redAccent[700]
                            }
                        }}
                    >
                        Reject All
                    </button>
                </div>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    style={{
                        width: '100%',
                        backgroundColor: snackbar.severity === 'error' ? colors.redAccent[600] : 
                                        snackbar.severity === 'success' ? colors.greenAccent[600] : 
                                        colors.blueAccent[600],
                        color: colors.grey[100]
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );

    async function handleBulkStatusUpdate(status) {
        try {
            setLoading(true);
            await api.put(`/admin/documents/bulk-status/${recruiterId}`, { status });
            setSnackbar({
                open: true,
                message: `All documents ${status} successfully`,
                severity: "success"
            });
            fetchDocuments();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || `Failed to ${status} documents`,
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    }
};