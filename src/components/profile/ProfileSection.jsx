import { Box, Typography, Divider } from "@mui/material";

const ProfileSection = ({ title, icon, children }) => (
  <Box mb={4}>
    <Box display="flex" alignItems="center" mb={2}>
      {icon}
      <Typography variant="h6" ml={1}>
        {title}
      </Typography>
    </Box>
    {children}
    <Divider sx={{ my: 2 }} />
  </Box>
);

export default ProfileSection;
