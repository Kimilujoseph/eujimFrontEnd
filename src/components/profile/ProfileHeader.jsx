import { Box, Typography, Button, Paper, Tabs, Tab } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";

const ProfileHeader = ({
  name,
  activeTab,
  handleTabChange,
  isEditing,
  setIsEditing,
}) => (
  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h4">{name}'s Profile</Typography>
      {!isEditing ? (
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
          type="button"
        >
          Edit Profile
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          type="submit"
        >
          Save Changes
        </Button>
      )}
    </Box>

    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      aria-label="profile tabs"
    >
      <Tab label="Basic Info" />
      <Tab label="Skills" />
      <Tab label="Education" />
      <Tab label="Certifications" />
    </Tabs>
  </Paper>
);

export default ProfileHeader;
