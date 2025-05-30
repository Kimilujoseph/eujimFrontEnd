import { Chip, Box, Button } from "@mui/material";
import { Code as CodeIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ProfileSection from "./ProfileSection";
import SkillDropdown from "./SkillsDropdown";

const SkillsSection = ({ skills, onAddSkill, onDeleteSkill }) => (
  <ProfileSection title="Skills" icon={<CodeIcon />}>
    <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
      {skills.map((skill) => (
        <Chip
          key={skill.id}
          label={`${skill.skill.skillName} (${skill.proffeciency_level})`}
          onDelete={() => onDeleteSkill(skill.id)}
          deleteIcon={<DeleteIcon />}
        />
      ))}
    </Box>

    <SkillDropdown onAddSkill={onAddSkill} />
  </ProfileSection>
);

export default SkillsSection;
