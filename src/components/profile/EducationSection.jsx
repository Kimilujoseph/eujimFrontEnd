import { Box, Typography, IconButton } from "@mui/material";
import {
  School as SchoolIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ProfileSection from "./ProfileSection";
import EducationForm from "./EducationForm";

const EducationSection = ({
  educations,
  newEducation,
  onEducationChange,
  onAddEducation,
  onDeleteEducation,
}) => (
  <ProfileSection title="Education" icon={<SchoolIcon />}>
    {educations.map((edu) => (
      <Box
        key={edu.id}
        mb={3}
        p={2}
        border={1}
        borderRadius={2}
        borderColor="divider"
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{edu.institution_name}</Typography>
          <IconButton onClick={() => onDeleteEducation(edu.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
        <Typography>
          <strong>Degree:</strong> {edu.qualification} in {edu.field_of_study}
        </Typography>
        <Typography>
          <strong>Years:</strong> {edu.start_year} - {edu.end_year}
        </Typography>
        {edu.description && (
          <Typography>
            <strong>Description:</strong> {edu.description}
          </Typography>
        )}
      </Box>
    ))}

    <EducationForm
      education={newEducation}
      onChange={onEducationChange}
      onSubmit={onAddEducation}
    />
  </ProfileSection>
);

export default EducationSection;
