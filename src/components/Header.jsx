import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box className="mb-4 sm:mb-8">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
        className="text-center sm:text-left"
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={colors.greenAccent[400]}
        className="text-center sm:text-left"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
