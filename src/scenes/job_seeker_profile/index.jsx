import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Button,
  Modal,
  TextField,
  CircularProgress
} from "@mui/material";
import ProfileHeader from "../../components/profile/ProfileHeader";
import BasicInfoSection from "../../components/profile/BasicInfoSection";
import SkillsSection from "../../components/profile/SkillsSection";
import EducationSection from "../../components/profile/EducationSection";
import api from "../../api/api";

const JobSeekerProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    location: "",
    bioData: "",
    about: "",
    linkedin_url: "",
    github_url: "",
  });
  const [newEducation, setNewEducation] = useState({
    institution_name: "",
    qualification: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    is_current: false,
    description: "",
    school_logo: "",
  });
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalForm, setModalForm] = useState({
    linkedin_url: "",
    github_url: "",
    about: "",
    location: ""
  });

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await api.get("/graduate/profile");
      setProfileData(response.data);
      setProfileNotFound(false);
      setFormData({
        firstName: response.data.profile.firstName,
        secondName: response.data.profile.secondName,
        email: response.data.profile.email,
        location: response.data.profile.location,
        bioData: response.data.profile.bioData,
        about: response.data.profile.about,
        linkedin_url: response.data.profile.linkedin_url,
        github_url: response.data.profile.github_url,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setProfileNotFound(true);
      } else {
        showSnackbar("Error fetching profile data", "error");
        console.error("Error fetching profile data:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle modal input changes
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.post("/graduate/profile/create-or-update", formData);
      showSnackbar("Profile updated successfully");
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error updating profile", "error");
      console.error("Error updating profile:", error);
    }
  };

  // Create new profile
  const handleCreateProfile = async () => {
    setIsCreating(true);
    try {
      const dataToSend = {
        location: modalForm.location,
        linkedin_url: modalForm.linkedin_url,
        github_url: modalForm.github_url,
        about: modalForm.about,
      };

      await api.post("/graduate/profile/create-or-update", dataToSend);
      showSnackbar("Profile created successfully");
      setCreateModalOpen(false);

      await api.post("/graduate/profile/create-or-update", dataToSend);
      showSnackbar("Profile created successfully");
      setCreateModalOpen(false);
      // Reload profile data
      await fetchProfileData();
    } catch (error) {
      showSnackbar("Error creating profile", "error");
      console.error("Error creating profile:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Skills CRUD Operations
  const handleAddSkill = async (skillData) => {
    try {
      console.log("skilldata", skillData);
      await api.post("/graduate/profile/skills/add/", {
        proffeciency_level: skillData.proffeciency_level,
        skill_name: skillData.skill_name,
      });
      showSnackbar("Skill added successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error adding skill", "error");
      console.error("Error adding skill:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/graduate/profile/skills/delete/${skillId}/`);
      showSnackbar("Skill deleted successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error deleting skill", "error");
      console.error("Error deleting skill:", error);
    }
  };

  const handleUpdateSkill = async (skillId, updatedData) => {
    try {
      await api.put(`/graduate/profile/skills/${skillId}`, updatedData);
      showSnackbar("Skill updated successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error updating skill", "error");
      console.error("Error updating skill:", error);
    }
  };

  // Education CRUD Operations
  const handleAddEducation = async () => {
    try {
      console.log("New Education Data:", newEducation);
      await api.post("/graduate/education/create", newEducation);
      showSnackbar("Education added successfully");
      setNewEducation({
        institution_name: "",
        qualification: "",
        degree: "",
        field_of_study: "",
        start_year: "",
        end_year: "",
        is_current: false,
        description: "",
        school_logo: "",
      });

      fetchProfileData();
    } catch (error) {
      showSnackbar("Error adding education", "error");
      console.error("Error adding education:", error);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      await api.delete(`/graduate/education/update/${educationId}`);
      showSnackbar("Education deleted successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error deleting education", "error");
      console.error("Error deleting education:", error);
    }
  };

  const handleUpdateEducation = async (educationId, updatedData) => {
    try {
      await api.put(`/graduate/education/update/${educationId}`, updatedData);
      showSnackbar("Education updated successfully");
      fetchProfileData();
    } catch (error) {
      showSnackbar("Error updating education", "error");
      console.error("Error updating education:", error);
    }
  };

  if (profileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <Typography variant="h5" gutterBottom>
            Profile Not Found
          </Typography>
          <Typography variant="body1" className="mb-6">
            It looks like you don't have a profile yet. Create one now to get started!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            className="w-full"
          >
            Create Profile
          </Button>
        </Card>

        {/* Create Profile Modal */}
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          aria-labelledby="create-profile-modal"
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 focus:outline-none">
            <Typography variant="h6" id="modal-title" className="mb-4">
              Create Your Profile
            </Typography>

            <TextField
              fullWidth
              label="GitHub URL"
              name="github_url"
              value={modalForm.github_url}
              onChange={handleModalInputChange}
              margin="normal"
              placeholder="https://github.com/yourusername"
            />

            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedin_url"
              value={modalForm.linkedin_url}
              onChange={handleModalInputChange}
              margin="normal"
              placeholder="https://linkedin.com/in/yourprofile"
            />


            <TextField
              fullWidth
              label="About You"
              name="about"
              value={modalForm.about}
              onChange={handleModalInputChange}
              margin="normal"
              multiline
              rows={4}
              placeholder="Brief introduction about yourself..."
            />


            <div className="mt-6 flex justify-end space-x-3">
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
                {isCreating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }


  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading profile data...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSaveProfile}
      className="w-full max-w-6xl mx-auto px-4 py-6"
    >
      <ProfileHeader
        name={`${profileData.profile.firstName} ${profileData.profile.secondName}`}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <div className="mt-6 grid grid-cols-1 gap-6">
        {activeTab === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
            <div className="p-4 md:p-6">
              <BasicInfoSection
                formData={formData}
                handleInputChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({ ...prev, [name]: value }));
                }}
                isEditing={isEditing}
              />
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
            <div className="p-4 md:p-6">
              <SkillsSection
                skills={profileData.skills}
                onAddSkill={handleAddSkill}
                onDeleteSkill={handleDeleteSkill}
                onUpdateSkill={handleUpdateSkill}
              />
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
            <div className="p-4 md:p-6">
              <EducationSection
                educations={profileData.educations}
                newEducation={newEducation}
                onEducationChange={(e) => {
                  const { name, value, type, checked } = e.target;
                  setNewEducation((prev) => ({
                    ...prev,
                    [name]: type === "checkbox" ? checked : value,
                  }));
                }}
                onAddEducation={handleAddEducation}
                onDeleteEducation={handleDeleteEducation}
                onUpdateEducation={handleUpdateEducation}
              />
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          className="shadow-lg"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default JobSeekerProfile;
