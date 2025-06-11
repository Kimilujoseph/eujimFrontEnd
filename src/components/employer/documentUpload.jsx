import {
    useTheme,
    Card,
    Snackbar,
    Alert,
    CardHeader,
    CardContent,
    List,
    LinearProgress,
    Typography,
    Box
} from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { CloudUpload, Delete, Download } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import { useAuth } from "../../auth/authContext"

export const DocumentsManager = ({ recruiterId }) => {
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
    const { user } = useAuth()

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/recruiter/documents/upload/${user?.id}`);
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
    }, [user?.id]);

    const handleUpload = async (files) => {
        setUploading(true);
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("upload_path", file);
                formData.append("doc_type", file.type);

                await api.post("/recruiter/documents/upload/", formData, {
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
            await api.delete(`/recruiter/documents/${docId}`);
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
    }, [recruiterId, fetchDocuments]);

    return (
        <Card sx={{
            backgroundColor: colors.primary[400],
            boxShadow: "none",
            border: `1px solid ${colors.grey[700]}`
        }}>
            <CardHeader
                title="Company Documents"
                titleTypographyProps={{
                    variant: "h5",
                    color: colors.grey[100]
                }}
                sx={{ borderBottom: `1px solid ${colors.grey[700]}` }}
            />

            <CardContent>
                {loading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Dropzone
                            onDrop={handleUpload}
                            accept={{
                                "image/*": [],
                                "application/pdf": [".pdf"]
                            }}
                            maxFiles={5}
                            disabled={uploading}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        p: 4,
                                        border: `2px dashed ${colors.grey[600]}`,
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        backgroundColor: colors.primary[500],
                                        cursor: "pointer",
                                        "&:hover": {
                                            borderColor: colors.greenAccent[500]
                                        }
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUpload sx={{
                                        fontSize: "3rem",
                                        color: colors.grey[300],
                                        mb: 1
                                    }} />
                                    <Typography variant="body1" color={colors.grey[100]}>
                                        Drag & drop files here, or click to select
                                    </Typography>
                                    <Typography variant="body2" color={colors.grey[400]}>
                                        (Accepted: images, PDFs, max 5 files)
                                    </Typography>
                                    {uploading && (
                                        <LinearProgress sx={{ mt: 2 }} />
                                    )}
                                </Box>
                            )}
                        </Dropzone>

                        <List sx={{ mt: 3 }}>
                            {documents.length === 0 ? (
                                <Typography
                                    variant="body1"
                                    color={colors.grey[300]}
                                    textAlign="center"
                                    sx={{ py: 4 }}
                                >
                                    No documents uploaded yet
                                </Typography>
                            ) : (
                                documents.map((doc) => (
                                    <ListItem
                                        key={doc.id}
                                        sx={{
                                            backgroundColor: colors.primary[500],
                                            mb: 1,
                                            borderRadius: "4px",
                                            "&:hover": {
                                                backgroundColor: colors.primary[600]
                                            }
                                        }}
                                        secondaryAction={
                                            <>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="download"
                                                    href={`/api/v1/recruiter/documents/${doc.id}/download`}
                                                    target="_blank"
                                                    sx={{ color: colors.greenAccent[500] }}
                                                >
                                                    <Download />
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(doc.id)}
                                                    sx={{ color: colors.redAccent[500] }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body1"
                                                    color={colors.grey[100]}
                                                    sx={{ wordBreak: "break-word" }}
                                                >
                                                    {doc.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    color={colors.grey[400]}
                                                >
                                                    {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.type}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </>
                )}
            </CardContent>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
};