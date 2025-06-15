import { useState, useEffect, useCallback } from "react";
import {
    Button,
    LinearProgress,
    Snackbar,
    Alert
} from "@mui/material";
import api from "../../api/api";
import { CloudUpload, Delete, Download, Close } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import { useAuth } from "../../auth/authContext";

export const DocumentsManager = ({ recruiterId, onClose }) => {
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
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {user?.role === 'admin' ? 'Manage Company Documents' : 'Company Documents'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <Close />
                </button>
            </div>

            <div className="p-4">
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
                                    className={`p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center bg-gray-50 dark:bg-gray-700 cursor-pointer transition-colors ${uploading ? 'opacity-70' : 'hover:border-green-500'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUpload className="text-4xl text-gray-400 dark:text-gray-300 mb-2 mx-auto" />
                                    <p className="text-gray-700 dark:text-gray-200">
                                        Drag & drop files here, or click to select
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        (Accepted: images, PDFs, Word docs, max 5 files)
                                    </p>
                                    {uploading && (
                                        <LinearProgress className="mt-3" />
                                    )}
                                </div>
                            )}
                        </Dropzone>

                        <div className="mt-4">
                            {documents.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                    No documents uploaded yet
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {documents.map((doc) => (
                                        <li
                                            key={doc.id || doc.upload_path}
                                            className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex justify-between items-center"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
                                                    {getFileName(doc.upload_path)}
                                                </p>
                                                <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>
                                                        {doc.createdAt && new Date(doc.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span>{doc.doc_type}</span>
                                                    <span className={`${doc.status === 'approved' ? 'text-green-500' :
                                                            doc.status === 'rejected' ? 'text-red-500' :
                                                                'text-yellow-500'
                                                        }`}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <a
                                                    href={user?.role === 'admin'
                                                        ? `/admin/documents/${doc.id}/download`
                                                        : `/recruiter/documents/${doc.id}/download/`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-500 hover:text-green-700 dark:hover:text-green-400 p-1"
                                                >
                                                    <Download />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
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
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={() => handleBulkStatusUpdate('approved')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    >
                        Approve All
                    </button>
                    <button
                        onClick={() => handleBulkStatusUpdate('rejected')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
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
                    className="w-full"
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