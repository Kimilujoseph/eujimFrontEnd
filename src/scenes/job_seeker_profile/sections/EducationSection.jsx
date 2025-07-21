import React, { useState } from 'react';
import { Edit, Delete, Add } from '@mui/icons-material';
import { IconButton, Button, Checkbox, FormControlLabel } from '@mui/material';

const EducationForm = ({ formState, handleInputChange, handleCancel, handleSave, editingId }) => (
    <div className="p-6 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            {editingId ? 'Edit Education' : 'Add New Education'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                <input
                    type="text"
                    name="institution_name"
                    value={formState.institution_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qualification</label>
                <input
                    type="text"
                    name="qualification"
                    value={formState.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
                <input
                    type="text"
                    name="degree"
                    value={formState.degree}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field of Study</label>
                <input
                    type="text"
                    name="field_of_study"
                    value={formState.field_of_study}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Year</label>
                <input
                    type="number"
                    name="start_year"
                    value={formState.start_year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Year</label>
                <input
                    type="number"
                    name="end_year"
                    value={formState.end_year}
                    onChange={handleInputChange}
                    disabled={formState.is_current}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                        formState.is_current ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                />
            </div>
            <div className="md:col-span-2">
                <FormControlLabel
                    control={
                        <Checkbox
                            name="is_current"
                            checked={formState.is_current}
                            onChange={handleInputChange}
                            color="primary"
                        />
                    }
                    label="Currently Studying Here"
                    className="text-gray-700 dark:text-gray-300"
                />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
);

const EducationSection = ({ educations = [], onAddEducation, onDeleteEducation, onUpdateEducation, isReadOnly }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState({
        institution_name: "", qualification: "", degree: "", field_of_study: "",
        start_year: "", end_year: "", is_current: false, description: ""
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        if (editingId) {
            onUpdateEducation(editingId, formState);
            setEditingId(null);
        } else {
            onAddEducation(formState);
        }
        setFormState({
            institution_name: "", qualification: "", degree: "", field_of_study: "",
            start_year: "", end_year: "", is_current: false, description: ""
        });
        setIsAdding(false);
    };

    const handleEdit = (edu) => {
        setEditingId(edu.id);
        setFormState({ ...edu, end_year: edu.end_year || '' });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormState({
            institution_name: "", qualification: "", degree: "", field_of_study: "",
            start_year: "", end_year: "", is_current: false, description: ""
        });
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Education</h2>
                {!isReadOnly && !isAdding && editingId === null && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsAdding(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Add Education
                    </Button>
                )}
            </div>

            {!isReadOnly && (isAdding || editingId !== null) && (
                <EducationForm
                    formState={formState}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    editingId={editingId}
                />
            )}

            <div className="space-y-4">
                {educations.length > 0 ? (
                    educations.map((edu) => (
                        editingId === edu.id ? null : (
                            <div key={edu.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                                {edu.institution_name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {edu.degree} in {edu.field_of_study}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {edu.start_year} - {edu.is_current ? 'Present' : edu.end_year}
                                            </p>
                                            {edu.description && (
                                                <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                        {!isReadOnly && (
                                            <div className="flex space-x-1">
                                                <IconButton 
                                                    onClick={() => handleEdit(edu)}
                                                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                                                    size="small"
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => onDeleteEducation(edu.id)}
                                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No education history added yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EducationSection;
