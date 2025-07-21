import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Box,
  Snackbar,
  Alert,
  useTheme,
  Button,
  CircularProgress,
  Card,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { tokens } from "../../theme";
import ProfileHeader from "../../components/profile/ProfileHeader";
import BasicInfoSection from "./sections/BasicInfoSection";
import SkillsSection from "./sections/SkillsSection";
import EducationSection from "./sections/EducationSection";
import CertificationsSection from "./sections/CertificationsSection";
import api from "../../api/api";

const ProfileSectionWrapper = ({ children, colors }) => (
  <div
    className="rounded-xl shadow-md overflow-hidden"
    style={{ backgroundColor: colors.primary[400] }}
  >
    {children}
  </div>
);

const JobSeekerProfile = () => {
  const { user } = useAuth();
  const { jobSeekerId } = useParams(); // For recruiter/admin view
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // A user is read-only if they are not the profile owner
  const isReadOnly = jobSeekerId && jobSeekerId !== user.id?.toString();

  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalForm, setModalForm] = useState({
    linkedin_url: "",
    github_url: "",
    about: "",
    location: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = jobSeekerId
        ? `/graduate/profile/${jobSeekerId}`
        : "/graduate/profile";
      const response = await api.get(endpoint);
      console.log(response.data);
      setProfileData(response.data);
      setProfileNotFound(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfileNotFound(true);
      } else {
        showSnackbar("Error fetching profile data", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [jobSeekerId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (isEditing) {
      setEditedData(profileData);
    } else {
      setEditedData(null);
    }
  }, [isEditing, profileData]);

  const handleSaveProfile = async () => {
    if (!editedData) return;
    try {
      await api.post("/graduate/profile/create-or-update", editedData.profile);
      showSnackbar("Profile updated successfully");
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error updating profile", "error");
    }
  };

  const handleCreateProfile = async () => {
    setIsCreating(true);
    try {
      await api.post("/graduate/profile/create-or-update", modalForm);
      showSnackbar("Profile created successfully");
      setCreateModalOpen(false);
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error creating profile", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleProfileInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [name]: value },
    }));
  }, []);

  // All API handlers now live in the parent and are passed down
  const handleAddSkill = async (skillData) => {
    try {
      await api.post("/graduate/profile/skills/add/", skillData);
      showSnackbar("Skill added successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error adding skill", "error");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/graduate/profile/skills/delete/${skillId}/`);
      showSnackbar("Skill deleted successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error deleting skill", "error");
    }
  };

  const handleAddEducation = async (eduData) => {
    try {
      await api.post("/graduate/education/create", eduData);
      showSnackbar("Education added successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error adding education", "error");
    }
  };

  const handleDeleteEducation = async (eduId) => {
    try {
      await api.delete(`/graduate/education/update/${eduId}`);
      showSnackbar("Education deleted successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error deleting education", "error");
    }
  };

  const handleUpdateEducation = async (eduId, eduData) => {
    try {
      await api.put(`/graduate/education/update/${eduId}`, eduData);
      showSnackbar("Education updated successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error updating education", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <Typography variant="h5" gutterBottom>
            Profile Not Found
          </Typography>
          <Typography variant="body1" className="mb-6">
            {isReadOnly
              ? "This user has not created a profile yet."
              : "It looks like you don't have a profile yet. Create one now!"}
          </Typography>
          {!isReadOnly && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateModalOpen(true)}
            >
              Create Profile
            </Button>
          )}
        </Card>
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
            <Typography variant="h6" className="mb-4">
              Create Your Profile
            </Typography>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={modalForm.location}
              onChange={(e) =>
                setModalForm({ ...modalForm, location: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="GitHub URL"
              name="github_url"
              value={modalForm.github_url}
              onChange={(e) =>
                setModalForm({ ...modalForm, github_url: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedin_url"
              value={modalForm.linkedin_url}
              onChange={(e) =>
                setModalForm({ ...modalForm, linkedin_url: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="About You"
              name="about"
              value={modalForm.about}
              onChange={(e) =>
                setModalForm({ ...modalForm, about: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={() => setCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateProfile}
                disabled={isCreating}
              >
                {isCreating ? <CircularProgress size={24} /> : "Create"}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center p-8">Could not load profile data.</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <ProfileHeader
        name={`${profileData.profile.firstName} ${profileData.profile.secondName}`}
        activeTab={activeTab}
        handleTabChange={(e, val) => setActiveTab(val)}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isReadOnly={isReadOnly}
      />

      <div className="mt-6">
        {activeTab === 0 && (
          <ProfileSectionWrapper colors={colors}>
            <BasicInfoSection
              profileData={
                editedData ? editedData.profile : profileData.profile
              }
              isEditing={isEditing && !isReadOnly && !!editedData}
              handleInputChange={handleProfileInputChange}
            />
            {isEditing && !isReadOnly && (
              <div
                className="flex justify-end p-4 border-t"
                style={{ borderColor: colors.grey[700] }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  variant="contained"
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </ProfileSectionWrapper>
        )}

        {activeTab === 1 && (
          <ProfileSectionWrapper colors={colors}>
            <SkillsSection
              skills={profileData.skills}
              onAddSkill={handleAddSkill}
              onDeleteSkill={handleDeleteSkill}
              isReadOnly={isReadOnly}
            />
          </ProfileSectionWrapper>
        )}

        {activeTab === 2 && (
          <ProfileSectionWrapper colors={colors}>
            <EducationSection
              educations={profileData.educations}
              onAddEducation={handleAddEducation}
              onDeleteEducation={handleDeleteEducation}
              onUpdateEducation={handleUpdateEducation}
              isReadOnly={isReadOnly}
            />
          </ProfileSectionWrapper>
        )}

        {activeTab === 3 && (
          <ProfileSectionWrapper colors={colors}>
            <CertificationsSection
              showSnackbar={showSnackbar}
              isReadOnly={isReadOnly}
              jobSeekerId={jobSeekerId}
            />
          </ProfileSectionWrapper>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          className="shadow-lg"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default JobSeekerProfile;
