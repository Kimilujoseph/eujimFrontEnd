import { Grid, TextField, Typography } from "@mui/material";
import ProfileSection from "./ProfileSection";
import {
  Person as PersonIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

const BasicInfoSection = ({ formData, handleInputChange, isEditing }) => (
  <ProfileSection title="Basic Information" icon={<PersonIcon />}>
    <Grid container spacing={3}>
      {/* First Name */}
      <Grid item xs={12} md={6}>
        {isEditing ? (
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            margin="normal"
          />
        ) : (
          <Typography>
            <strong>First Name:</strong> {formData.firstName}
          </Typography>
        )}
      </Grid>

      {/* Second Name */}
      <Grid item xs={12} md={6}>
        {isEditing ? (
          <TextField
            fullWidth
            label="Second Name"
            name="secondName"
            value={formData.secondName}
            onChange={handleInputChange}
            margin="normal"
          />
        ) : (
          <Typography>
            <strong>Second Name:</strong> {formData.secondName}
          </Typography>
        )}
      </Grid>

      {/* Email (read-only) */}
      <Grid item xs={12}>
        {isEditing ? (
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            disabled
            InputProps={{
              startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        ) : (
          <Typography>
            <strong>Email:</strong> {formData.email}
          </Typography>
        )}
      </Grid>

      {/* Location */}
      <Grid item xs={12}>
        {isEditing ? (
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{
              startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        ) : (
          <Typography>
            <strong>Location:</strong> {formData.location || "Not specified"}
          </Typography>
        )}
      </Grid>
    </Grid>

    {/* Bio Section */}
    <ProfileSection title="Bio" icon={<DescriptionIcon />}>
      {isEditing ? (
        <TextField
          fullWidth
          label="Bio"
          name="bioData"
          value={formData.bioData}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={4}
        />
      ) : (
        <Typography>{formData.bioData}</Typography>
      )}
    </ProfileSection>

    {/* About Section (conditional) */}
    {formData.about && (
      <ProfileSection title="About" icon={<DescriptionIcon />}>
        {isEditing ? (
          <TextField
            fullWidth
            label="About"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
        ) : (
          <Typography>{formData.about}</Typography>
        )}
      </ProfileSection>
    )}

    {/* Social Links Section (conditional) */}
    {(formData.linkedin_url || formData.github_url) && (
      <ProfileSection title="Social Links" icon={<LinkIcon />}>
        {isEditing ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin_url"
                value={formData.linkedin_url || ""}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                name="github_url"
                value={formData.github_url || ""}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={1}>
            {formData.linkedin_url && (
              <Grid item>
                <Typography>
                  <strong>LinkedIn:</strong> {formData.linkedin_url}
                </Typography>
              </Grid>
            )}
            {formData.github_url && (
              <Grid item>
                <Typography>
                  <strong>GitHub:</strong> {formData.github_url}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </ProfileSection>
    )}
  </ProfileSection>
);

export default BasicInfoSection;
