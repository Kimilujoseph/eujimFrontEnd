import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
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

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await api.get("/graduate/profile");
      setProfileData(response.data);
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
      showSnackbar("Error fetching profile data", "error");
      console.error("Error fetching profile data:", error);
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

  // Profile CRUD Operations
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
      await api.delete(`/graduate/profile/skills/${skillId}`);
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
