import React, { useState } from 'react';
import {
    Typography,
    Chip,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { tokens } from '../../../theme';

const SkillsSection = ({ skills = [], onAddSkill, onDeleteSkill, isReadOnly }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [newSkill, setNewSkill] = useState({
        skill_name: '',
        proffeciency_level: 'intermediate' // Note the double 'f' to match API
    });

    const handleAddClick = () => {
        if (newSkill.skill_name.trim()) {
            onAddSkill({
                proffeciency_level: newSkill.proffeciency_level,
                skill_name: newSkill.skill_name
            });
            setNewSkill({
                skill_name: '',
                proffeciency_level: 'intermediate'
            });
        }
    };

    // Proficiency levels with exact spelling as in your API
    const proficiencyLevels = [
        { value: 'begginner', label: 'Beginner' }, // Note the double 'g'
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'midlevel', label: 'Mid-Level' },
        { value: 'proffessional', label: 'Professional' } // Note the double 'f'
    ];

    // Helper to get display label for chip
    const getProficiencyLabel = (level) => {
        const found = proficiencyLevels.find(l => l.value === level);
        return found ? found.label : level;
    };

    return (
        <div className="p-4 md:p-6">
            <Typography variant="h5" className="font-bold mb-4">
                Skills
            </Typography>

            {!isReadOnly && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.primary[500] }}>
                    <Typography variant="h6" className="mb-4">Add New Skill</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <TextField
                            label="Skill Name"
                            value={newSkill.skill_name}
                            onChange={(e) => setNewSkill({
                                ...newSkill,
                                skill_name: e.target.value
                            })}
                            variant="outlined"
                            size="small"
                            placeholder="e.g., React"
                        />
                        <FormControl size="small" variant="outlined">
                            <InputLabel>Proficiency</InputLabel>
                            <Select
                                value={newSkill.proffeciency_level}
                                onChange={(e) => setNewSkill({
                                    ...newSkill,
                                    proffeciency_level: e.target.value
                                })}
                                label="Proficiency"
                            >
                                {proficiencyLevels.map(level => (
                                    <MenuItem
                                        key={level.value}
                                        value={level.value}
                                    >
                                        {level.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={handleAddClick}
                            startIcon={<Add />}
                            disabled={!newSkill.skill_name.trim()}
                            sx={{
                                backgroundColor: colors.greenAccent[600],
                                '&:hover': {
                                    backgroundColor: colors.greenAccent[700]
                                }
                            }}
                        >
                            Add Skill
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill) => (
                    <Chip
                        key={skill.id}
                        label={`${skill.skill.skillName} (${getProficiencyLabel(skill.proffeciency_level)})`}
                        onDelete={!isReadOnly ? () => onDeleteSkill(skill.id) : undefined}
                        deleteIcon={!isReadOnly ? <Delete /> : undefined}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            '& .MuiChip-deleteIcon': {
                                color: colors.redAccent[500],
                                '&:hover': {
                                    color: colors.redAccent[400],
                                }
                            }
                        }}
                    />
                )) : (
                    <Typography className="text-gray-500">No skills added yet.</Typography>
                )}
            </div>
        </div>
    );
};

export default SkillsSection;