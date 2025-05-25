import React, { useState, useContext } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContactsIcon from "@mui/icons-material/Contacts";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
  { text: "Graduate Management", icon: <PeopleIcon />, to: "/graduates" },
  { text: "Employer Management", icon: <ContactsIcon />, to: "/employers" },
  { text: "Settings", icon: <PieChartIcon />, to: "/settings" },
  { text: "Logout", icon: <ReceiptIcon />, to: "/logout" },
];
const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ isSidebar = true }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return "JD";
    const firstInitial = user.firstName ? user.firstName.charAt(0) : "";
    const secondInitial = user.secondName ? user.secondName.charAt(0) : "";
    return `${firstInitial}${secondInitial}`.toUpperCase();
  };

  const getFullName = () => {
    if (!user) return "John Doe";
    return `${user.firstName || ""} ${user.secondName || ""}`.trim();
  };

  const getUserRole = () => {
    if (!user) return "VP Fancy Admin";
    switch (user.role) {
      case "superAdmin":
        return "Super Admin";
      case "admin":
        return "Administrator";
      case "employer":
        return "Employer";
      case "jobseeker":
        return "Job Seeker";
      default:
        return "User";
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebar}
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          background: colors.primary[400],
          color: colors.grey[100],
          overflowX: "hidden",
          transition: "width 0.2s",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={collapsed ? 1 : 2}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent={collapsed ? "center" : "flex-end"}
          >
            <Tooltip title={collapsed ? "Expand" : "Collapse"}>
              <IconButton
                onClick={() => setCollapsed((prev) => !prev)}
                sx={{ color: colors.grey[100] }}
                size="small"
              >
                {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Always show avatar - different sizes based on collapsed state */}
          <Avatar
            alt={getFullName()}
            sx={{
              width: collapsed ? 40 : 100,
              height: collapsed ? 40 : 100,
              bgcolor: colors.greenAccent[500],
              fontSize: collapsed ? "1rem" : "2rem",
              mb: collapsed ? 0 : 1,
            }}
          >
            {getInitials()}
          </Avatar>

          {/* Only show name and role when expanded */}
          {!collapsed && (
            <>
              <Typography variant="h6" fontWeight={700}>
                {getFullName()}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]}>
                {getUserRole()}
              </Typography>
            </>
          )}
        </Box>
        <Divider sx={{ background: colors.grey[700] }} />
      </Box>
      <Box flex={1} overflow="auto">
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              sx={{
                color: colors.grey[100],
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 2,
                "&.Mui-selected": {
                  background: colors.primary[600],
                  color: colors.grey[100],
                },
                "&:hover": {
                  background: colors.primary[700],
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: colors.grey[100],
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
