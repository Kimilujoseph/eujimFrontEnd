// src/pages/TokenExpiredPage.jsx
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Button, Typography, Box, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router-dom";

const TokenExpiredPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: 3,
            }}
        >
            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                <ErrorOutlineIcon
                    sx={{
                        fontSize: 80,
                        color: colors.redAccent[500],
                        mb: 2,
                    }}
                />
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: colors.grey[100], fontWeight: 600 }}
                >
                    Verification Link Expired
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: colors.grey[300], mb: 3 }}
                >
                    The email verification link you used has expired. For security reasons,
                    these links are only valid for a limited time.
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: colors.grey[300], mb: 4 }}
                >
                    Please request a new verification link below or contact support if you
                    need assistance.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/request-new-verification"
                        sx={{
                            backgroundColor: colors.greenAccent[600],
                            color: colors.grey[900],
                            "&:hover": {
                                backgroundColor: colors.greenAccent[700],
                            },
                        }}
                    >
                        Request New Link
                    </Button>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/contact-support"
                        sx={{
                            borderColor: colors.blueAccent[500],
                            color: colors.blueAccent[500],
                            "&:hover": {
                                borderColor: colors.blueAccent[600],
                            },
                        }}
                    >
                        Contact Support
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default TokenExpiredPage;