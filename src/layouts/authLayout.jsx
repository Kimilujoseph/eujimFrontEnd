import React from "react";
import { Box } from "@mui/material";

const AuthLayout = ({ children }) => (
  <Box
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {children}
  </Box>
);

export default AuthLayout;
