import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ProfileHeader from "../../components/profile/ProfileHeader";
import BasicInfoSection from "../../components/profile/BasicInfoSection";
import SkillsSection from "../../components/profile/SkillsSection";
import EducationSection from "../../components/profile/EducationSection";
import api from "../../api/api";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const JobSeekerProfile = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  const [certifications, setCertifications] = useState([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [addingCertification, setAddingCertification] = useState(false);
  const [editingCertificationId, setEditingCertificationId] = useState(null);
  const [certForm, setCertForm] = useState({
    issuer: '',
    awarded_date: '',
    upload_path: '',
    description: ''
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
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCertifications = async () => {
    setLoadingCertifications(true);
    try {
      const response = await api.get('/graduate/certifications/');
      setCertifications(response.data);
    } catch (error) {
      showSnackbar('Error fetching certifications', 'error');
    } finally {
      setLoadingCertifications(false);
    }
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCertForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    setAddingCertification(true);

    try {
      if (editingCertificationId) {
        await api.put(`/graduate/certifications/${editingCertificationId}/update/`, certForm);
        showSnackbar('Certification updated successfully');
      } else {
        await api.post('/graduate/certifications/add/', certForm);
        showSnackbar('Certification added successfully');
      }

      setCertForm({
        issuer: '',
        awarded_date: '',
        upload_path: '',
        description: ''
      });
      setEditingCertificationId(null);
      fetchCertifications();
    } catch (error) {
      showSnackbar('Error saving certification', 'error');
    } finally {
      setAddingCertification(false);
    }
  };

  const handleEditCertification = (cert) => {
    setCertForm({
      issuer: cert.issuer,
      awarded_date: cert.awarded_date.split('T')[0],
      upload_path: cert.upload_path || '',
      description: cert.description
    });
    setEditingCertificationId(cert.id);
  };

  const handleCancelEdit = () => {
    setCertForm({
      issuer: '',
      awarded_date: '',
      upload_path: '',
      description: ''
    });
    setEditingCertificationId(null);
  };

  const handleDeleteCertification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      await api.delete(`/graduate/certifications/${id}/delete/`);
      showSnackbar('Certification deleted successfully');
      fetchCertifications();
    } catch (error) {
      showSnackbar('Error deleting certification', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 3) {
      fetchCertifications();
    }
  }, [activeTab]);

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

  const fetchCerts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/graduate/certifications/");
      setCerts(res.data);
    } catch {
      setError("Failed to load certifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchCerts();
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
      await fetchProfileData();
    } catch (error) {
      showSnackbar("Error creating profile", "error");
      console.error("Error creating profile:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
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

  const handleAddEducation = async () => {
    try {
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

  const handleChange = (e) => {
    setCertForm({ ...certForm, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/graduate/certifications/add/", certForm);
      setSuccess("Certification added!");
      setCertForm({ issuer: "", upload_path: "", awarded_date: "", description: "" });
      fetchCerts();
    } catch {
      setError("Failed to add certification.");
    } finally {
      setAdding(false);
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
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <ProfileHeader
        name={`${profileData.profile.firstName} ${profileData.profile.secondName}`}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <div className="mt-6 grid grid-cols-1 gap-6">
        {activeTab === 0 && (
          <div className="rounded-xl shadow-md overflow-hidden transition-all duration-300" style={{
            backgroundColor: colors.primary[400]
          }} >
            <div className="p-4 md:p-6">
              <form onSubmit={handleSaveProfile}>
                <BasicInfoSection
                  formData={formData}
                  handleInputChange={(e) => {
                    const { name, value } = e.target;
                    setFormData((prev) => ({ ...prev, [name]: value }));
                  }}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <div className="flex justify-end mt-4 space-x-3">
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="rounded-xl shadow-md overflow-hidden transition-all duration-300" style={{
            backgroundColor: colors.primary[400],
          }}>
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
          <div className="rounded-xl shadow-md overflow-hidden transition-all duration-300" style={{
            backgroundColor: colors.primary[400],
          }}>
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

        {activeTab === 3 && (
          <div className="rounded-xl shadow-md overflow-hidden transition-all duration-300" style={{
            backgroundColor: colors.primary[400],
          }}>
            <div className="p-4 md:p-6">
              <Typography variant="h6" className="mb-4" color="primary">
                Certifications
              </Typography>

              <Box component="form" onSubmit={handleAddCertification} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TextField
                  label="Issuer"
                  name="issuer"
                  value={certForm.issuer}
                  onChange={handleCertificationChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Awarded Date"
                  name="awarded_date"
                  type="date"
                  value={certForm.awarded_date}
                  onChange={handleCertificationChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Certificate URL"
                  name="upload_path"
                  value={certForm.upload_path}
                  onChange={handleCertificationChange}
                  fullWidth
                  placeholder="https://drive.google.com/..."
                />
                <TextField
                  label="Description"
                  name="description"
                  value={certForm.description}
                  onChange={handleCertificationChange}
                  required
                  fullWidth
                  multiline
                  rows={3}
                />
                <div className="flex items-center md:col-span-2">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={addingCertification}
                    className="flex items-center"
                    sx={{ mr: 2, background: colors.greenAccent[500] }}
                  >
                    {addingCertification ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <AddIcon className="mr-2" />
                        Add Certification
                      </>
                    )}
                  </Button>
                  {editingCertificationId && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </Box>

              {loadingCertifications ? (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  {certifications.length === 0 ? (
                    <Typography variant="body1" className="text-center text-gray-500 py-4">
                      No certifications added yet.
                    </Typography>
                  ) : (
                    certifications.map((cert) => (
                      <Card key={cert.id} className="mb-4">
                        <CardContent>
                          <div className="flex justify-between items-start">
                            <div>
                              <Typography variant="h6" component="div">
                                {cert.issuer}
                              </Typography>
                              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Awarded on: {new Date(cert.awarded_date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {cert.description}
                              </Typography>
                              {cert.upload_path && (
                                <MuiLink
                                  href={cert.upload_path}
                                  target="_blank"
                                  rel="noopener"
                                  color="primary"
                                  variant="body2"
                                  className="flex items-center mt-2"
                                >
                                  <CloudUploadIcon className="mr-1" sx={{ color: colors.greenAccent[500] }} />
                                  <Typography variant="body2" sx={{ color: colors.blueAccent[500] }}>Download Certificate</Typography>
                                </MuiLink>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <IconButton
                                color="primary"
                                onClick={() => handleEditCertification(cert)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteCertification(cert.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
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
    </div>
  );
};

export default JobSeekerProfile;