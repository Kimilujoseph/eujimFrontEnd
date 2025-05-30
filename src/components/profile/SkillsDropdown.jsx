import { useState } from "react";
import { Autocomplete, TextField, Chip, Box, Button } from "@mui/material";

const predefinedSkills = [
  {
    skillName: "REST API",
    description: "API development using REST principles",
  },
  { skillName: "Node.js", description: "JavaScript runtime environment" },
  { skillName: "React", description: "Frontend JavaScript library" },
  { skillName: "MongoDB", description: "NoSQL database program" },
  { skillName: "Express", description: "Backend web application framework" },
  { skillName: "GraphQL", description: "Query language for APIs" },
  { skillName: "TypeScript", description: "Typed JavaScript superset" },
  { skillName: "Python", description: "High-level programming language" },
  { skillName: "Django", description: "Python web framework" },
  { skillName: "Flask", description: "Python micro web framework" },
  { skillName: "Java", description: "Object-oriented programming language" },
  { skillName: "Spring Boot", description: "Java-based framework" },
  { skillName: "C#", description: ".NET programming language" },
  { skillName: "ASP.NET", description: "Web framework by Microsoft" },
  { skillName: "PHP", description: "Server-side scripting language" },
  { skillName: "Laravel", description: "PHP web framework" },
  { skillName: "SQL", description: "Structured Query Language" },
  { skillName: "PostgreSQL", description: "Relational database system" },
  { skillName: "MySQL", description: "Relational database management system" },
  { skillName: "Firebase", description: "Google's mobile/web platform" },
  { skillName: "Docker", description: "Containerization platform" },
  { skillName: "Kubernetes", description: "Container orchestration system" },
  { skillName: "AWS", description: "Amazon Web Services" },
  { skillName: "Azure", description: "Microsoft cloud platform" },
  { skillName: "Google Cloud", description: "Google's cloud services" },
  { skillName: "CI/CD", description: "Continuous Integration/Deployment" },
  { skillName: "Git", description: "Version control system" },
  { skillName: "GitHub", description: "Code hosting platform" },
  { skillName: "GitLab", description: "DevOps platform" },
  { skillName: "Jenkins", description: "Automation server" },
  { skillName: "Terraform", description: "Infrastructure as code tool" },
  { skillName: "Ansible", description: "Configuration management" },
  { skillName: "Next.js", description: "React framework for production" },
  { skillName: "Vue.js", description: "Progressive JavaScript framework" },
  { skillName: "Angular", description: "Frontend framework by Google" },
  { skillName: "Svelte", description: "Component-based frontend framework" },
  { skillName: "Redux", description: "State management for JavaScript apps" },
  { skillName: "Webpack", description: "JavaScript module bundler" },
  { skillName: "Babel", description: "JavaScript compiler" },
  { skillName: "Jest", description: "JavaScript testing framework" },
  { skillName: "Mocha", description: "JavaScript test framework" },
  { skillName: "Cypress", description: "End-to-end testing framework" },
  { skillName: "Selenium", description: "Web browser automation" },
  { skillName: "HTML5", description: "Markup language for web pages" },
  { skillName: "CSS3", description: "Style sheet language" },
  { skillName: "SASS/SCSS", description: "CSS preprocessor" },
  { skillName: "Tailwind CSS", description: "Utility-first CSS framework" },
  { skillName: "Bootstrap", description: "CSS framework" },
  { skillName: "Material UI", description: "React UI framework" },
  { skillName: "Electron", description: "Desktop app framework" },
  { skillName: "React Native", description: "Mobile app framework" },
  { skillName: "Flutter", description: "UI toolkit by Google" },
  { skillName: "Swift", description: "Apple's programming language" },
  { skillName: "Kotlin", description: "Android development language" },
  { skillName: "TensorFlow", description: "Machine learning library" },
  { skillName: "PyTorch", description: "Machine learning framework" },
  { skillName: "Pandas", description: "Data analysis library" },
  { skillName: "NumPy", description: "Scientific computing package" },
  { skillName: "Elasticsearch", description: "Search and analytics engine" },
  { skillName: "Redis", description: "In-memory data store" },
  { skillName: "Kafka", description: "Distributed event streaming" },
  { skillName: "RabbitMQ", description: "Message broker" },
  { skillName: "Linux", description: "Unix-like operating system" },
  { skillName: "Bash", description: "Unix shell and command language" },
  { skillName: "Blockchain", description: "Distributed ledger technology" },
  { skillName: "Solidity", description: "Ethereum smart contract language" },
  { skillName: "Web3.js", description: "Ethereum JavaScript API" },
  { skillName: "Three.js", description: "3D graphics library" },
  { skillName: "D3.js", description: "Data visualization library" },
];

const SkillDropdown = ({ onAddSkill }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proffeciency_level, setProficiency] = useState("begginner");

  const handleAdd = () => {
    if (selectedSkill) {
      onAddSkill({
        skill_name: selectedSkill.skillName,
        proffeciency_level: proffeciency_level,
        description: selectedSkill.description,
      });
      setSelectedSkill(null);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Autocomplete
        options={predefinedSkills}
        getOptionLabel={(option) => option.skillName}
        style={{ width: 300 }}
        value={selectedSkill}
        onChange={(e, newValue) => setSelectedSkill(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Select Skill" variant="outlined" />
        )}
      />
      <TextField
        select
        label="Proficiency"
        value={proffeciency_level}
        onChange={(e) => setProficiency(e.target.value)}
        SelectProps={{ native: true }}
      >
        {["begginner", "intermediate", "midlevel", "professional"].map(
          (level) => (
            <option key={level} value={level}>
              {level}
            </option>
          )
        )}
      </TextField>
      <Button variant="contained" onClick={handleAdd}>
        Add Skill
      </Button>
    </Box>
  );
};

export default SkillDropdown;
