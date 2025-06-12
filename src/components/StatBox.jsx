import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="mb-2">{icon}</div>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </div>
        <div className="ml-4">
          <ProgressCircle progress={progress} size={60} />
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </div>
    </div>
  );
};

export default StatBox;