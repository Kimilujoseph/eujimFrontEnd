import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Link as MuiLink,
    useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import api from "../../api/api";

const statusColorMap = (colors) => ({
    interviewed: colors.yellowAccent[600],
    shortlisted: colors.blueAccent[600],
    rejected: colors.redAccent[600],
    hired: colors.greenAccent[600],
});

const InterviewHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const statusColors = statusColorMap(colors);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(`/recruiter/tracking/jobseeker/`);
                setHistory(res.data);
            } catch (err) {
                setError("Failed to load interview history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-40">
                <CircularProgress sx={{ color: colors.greenAccent[500] }} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!history.length) {
        return (
            <Typography className="text-center py-8" sx={{ color: colors.grey[400] }}>
                No interview history found.
            </Typography>
        );
    }

    return (
        <Box className="w-full max-w-2xl mx-auto space-y-4">
            <Typography
                variant="h5"
                className="mb-4 text-center"
                sx={{ color: colors.greenAccent[500], fontWeight: 700 }}
            >
                Interview History
            </Typography>
            {history.map((item) => (
                <Card
                    key={item.recruitmentId}
                    className="shadow"
                    sx={{
                        backgroundColor: colors.primary[400],
                        borderLeft: `6px solid ${statusColors[item.status] || colors.grey[700]}`,
                        borderRadius: 2,
                    }}
                >
                    <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.grey[100] }}>
                                {item.companyName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                                {item.companyInfo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Typography>
                            {item.notes && (
                                <Typography variant="body2" sx={{ mt: 2, color: colors.blueAccent[200] }}>
                                    <span className="font-semibold">Notes:</span> {item.notes}
                                </Typography>
                            )}
                            <div className="flex gap-2 mt-2">
                                {item.githubUrl && (
                                    <MuiLink
                                        href={item.githubUrl}
                                        target="_blank"
                                        rel="noopener"
                                        underline="hover"
                                        sx={{ color: colors.blueAccent[300], fontWeight: 500 }}
                                    >
                                        GitHub
                                    </MuiLink>
                                )}
                                {item.linkedinUrl && (
                                    <MuiLink
                                        href={item.linkedinUrl}
                                        target="_blank"
                                        rel="noopener"
                                        underline="hover"
                                        sx={{ color: colors.blueAccent[200], fontWeight: 500 }}
                                    >
                                        LinkedIn
                                    </MuiLink>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Chip
                                label={item.status_display}
                                sx={{
                                    backgroundColor: statusColors[item.status] || colors.grey[700],
                                    color: colors.grey[900],
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    mb: 2,
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default InterviewHistory;