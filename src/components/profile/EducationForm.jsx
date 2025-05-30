import {
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const EducationForm = ({ education, onChange, onSubmit }) => (
  <Box mt={4} p={2} border={1} borderRadius={2} borderColor="divider">
    <Typography variant="h6" mb={2}>
      Add New Education
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Institution Name"
          name="institution_name"
          value={education.institution_name}
          onChange={onChange}
          margin="normal"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Qualification"
          name="qualification"
          value={education.qualification}
          onChange={onChange}
          margin="normal"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Degree Level"
          name="degree"
          value={education.degree}
          onChange={onChange}
          margin="normal"
          required
          select
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          <option value="certificate">Certificate</option>
          <option value="diploma">Diploma</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD</option>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Field of Study"
          name="field_of_study"
          value={education.field_of_study}
          onChange={onChange}
          margin="normal"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Start Year"
          name="start_year"
          type="number"
          value={education.start_year}
          onChange={onChange}
          margin="normal"
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="End Year (or expected)"
          name="end_year"
          type="number"
          value={education.end_year}
          onChange={onChange}
          margin="normal"
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
        />
      </Grid>
      <Grid item xs={12}>
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
            />
          }
          label="I am currently studying here"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={education.description}
          onChange={onChange}
          margin="normal"
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="School Logo URL"
          name="school_logo"
          value={education.school_logo}
          onChange={onChange}
          margin="normal"
          placeholder="https://example.com/logo.png"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onSubmit}
          fullWidth
          size="large"
        >
          Add Education
        </Button>
      </Grid>
    </Grid>
  </Box>
);

export default EducationForm;
