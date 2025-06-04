import { 
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const EducationForm = ({ education, onChange, onSubmit }) => (
  <div className="mt-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all duration-300">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      Add New Education
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Institution Name */}
      <div className="md:col-span-2">
        <TextField
          fullWidth
          label="Institution Name"
          name="institution_name"
          value={education.institution_name}
          onChange={onChange}
          className="w-full"
          required
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* Qualification */}
      <div>
        <TextField
          fullWidth
          label="Qualification"
          name="qualification"
          value={education.qualification}
          onChange={onChange}
          className="w-full"
          required
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* Degree Level */}
      <div>
        <TextField
          fullWidth
          label="Degree Level"
          name="degree"
          value={education.degree}
          onChange={onChange}
          className="w-full"
          required
          select
          SelectProps={{ native: true }}
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        >
          <option value=""></option>
          <option value="certificate">Certificate</option>
          <option value="diploma">Diploma</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD</option>
        </TextField>
      </div>

      {/* Field of Study */}
      <div className="md:col-span-2">
        <TextField
          fullWidth
          label="Field of Study"
          name="field_of_study"
          value={education.field_of_study}
          onChange={onChange}
          className="w-full"
          required
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* Start Year */}
      <div>
        <TextField
          fullWidth
          label="Start Year"
          name="start_year"
          type="number"
          value={education.start_year}
          onChange={onChange}
          className="w-full"
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() }}
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* End Year */}
      <div>
        <TextField
          fullWidth
          label="End Year (or expected)"
          name="end_year"
          type="number"
          value={education.end_year}
          onChange={onChange}
          className="w-full"
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* Currently Studying */}
      <div className="md:col-span-2 py-2">
        <FormControlLabel
          control={
            <Checkbox
              name="is_current"
              checked={education.is_current}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "is_current",
                    type: "checkbox",
                    checked: e.target.checked,
                  },
                })
              }
              className="dark:text-blue-400"
            />
          }
          label="I am currently studying here"
          className="dark:text-gray-300"
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={education.description}
          onChange={onChange}
          className="w-full"
          multiline
          rows={4}
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* School Logo URL */}
      <div className="md:col-span-2">
        <TextField
          fullWidth
          label="School Logo URL"
          name="school_logo"
          value={education.school_logo}
          onChange={onChange}
          className="w-full"
          placeholder="https://example.com/logo.png"
          InputProps={{
            className: "dark:text-white"
          }}
          InputLabelProps={{
            className: "dark:text-gray-400"
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 mt-2">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onSubmit}
          fullWidth
          size="large"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 font-medium transition-colors duration-300"
        >
          Add Education
        </Button>
      </div>
    </div>
  </div>
);

export default EducationForm;