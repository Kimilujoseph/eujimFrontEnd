import React from "react";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => (
  <Box display="flex" height="100vh">
    <Sidebar />
    <Box flex={1} display="flex" flexDirection="column">
      <Topbar />
      <Box flex={1} p={2} overflow="auto">
        {children}
      </Box>
    </Box>
  </Box>
);

export default MainLayout;
