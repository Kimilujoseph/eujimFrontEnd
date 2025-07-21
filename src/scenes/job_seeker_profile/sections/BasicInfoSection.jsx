import React from 'react';
import { TextField, Typography } from '@mui/material';
import { Email, LocationOn, Person, Link as LinkIcon, Notes as NotesIcon } from '@mui/icons-material';

const InfoItem = ({ icon, label, value, isEditing, onChange, name, multiline = false, placeholder }) => (
    <div className="mb-4">
        <div className="flex items-center mb-2">
            {icon}
            <Typography variant="subtitle1" className="ml-2 font-bold">
                {label}
            </Typography>
        </div>
        {isEditing ? (
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                name={name}
                value={value || ''}
                onChange={onChange}
                multiline={multiline}
                rows={multiline ? 4 : 1}
                placeholder={placeholder}
            />
        ) : (
            <Typography variant="body1" className="whitespace-pre-wrap break-words">
                {value || <span className="text-gray-500">Not specified</span>}
            </Typography>
        )}
    </div>
);

const BasicInfoSection = ({ profileData, isEditing, handleInputChange }) => {
    if (!profileData) {
        return null;
    }

    const {
        firstName,
        secondName,
        email,
        location,
        bioData,
        linkedin_url,
        github_url,
    } = profileData;

    // Parse bioData to separate tagline from the main about text
    let tagline = '';
    let aboutText = '';
    if (bioData && typeof bioData === 'string') {
        const parts = bioData.split(' | ');
        if (parts.length > 1) {
            tagline = parts[0];
            aboutText = parts.slice(1).join(' | ');
        } else {
            aboutText = bioData;
        }
    }

    return (
        <div className="p-4 md:p-6">
            <Typography variant="h5" className="font-bold mb-6">
                Basic Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoItem
                    icon={<Person />}
                    label="Full Name"
                    value={`${firstName || ''} ${secondName || ''}`}
                    isEditing={false}
                />
                <InfoItem
                    icon={<Email />}
                    label="Email"
                    value={email}
                    isEditing={false}
                />
                <InfoItem
                    icon={<LocationOn />}
                    label="Location"
                    value={location}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    name="location"
                    placeholder="e.g., San Francisco, CA"
                />
                <InfoItem
                    icon={<LinkIcon />}
                    label="LinkedIn Profile"
                    value={linkedin_url}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    name="linkedin_url"
                    placeholder="https://linkedin.com/in/your-profile"
                />
                <InfoItem
                    icon={<LinkIcon />}
                    label="GitHub Profile"
                    value={github_url}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    name="github_url"
                    placeholder="https://github.com/your-username"
                />
            </div>

            {/* Display Tagline in read-only mode */}
            {!isEditing && tagline && (
                <div className="mt-6">
                    <InfoItem
                        icon={<NotesIcon />}
                        label="Bio"
                        value={tagline}
                        isEditing={false}
                    />
                </div>
            )}

            <div className="mt-6">
                <div className="flex items-center mb-2">
                    <Person className="mr-2" />
                    <Typography variant="subtitle1" className="font-bold">
                        About
                    </Typography>
                </div>
                {isEditing ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="bioData"
                        label="Bio & About"
                        helperText="Use a ' | ' to separate your one-line bio from the detailed about section."
                        value={bioData || ''}
                        onChange={handleInputChange}
                        multiline
                        rows={8}
                        placeholder="Your one-line bio... | Your detailed about section..."
                    />
                ) : (
                    <Typography variant="body1" className="whitespace-pre-wrap break-words">
                        {aboutText || <span className="text-gray-500">Not specified</span>}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default BasicInfoSection;
