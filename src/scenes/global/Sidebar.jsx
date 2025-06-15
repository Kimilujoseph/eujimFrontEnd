import React, { useState } from "react";
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
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContactsIcon from "@mui/icons-material/Contacts";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildIcon from "@mui/icons-material/Build";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";

// Define menu items for different roles
const roleBasedMenuItems = {
  superAdmin: [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { text: "Graduate Management", icon: <PeopleIcon />, to: "/graduates" },
    { text: "Employer Management", icon: <ContactsIcon />, to: "/employers" },
    { text: "Admin Management", icon: <ContactsIcon />, to: "/admin" },
    { text: "Settings", icon: <PieChartIcon />, to: "/settings" },
    { text: "Logout", icon: <LogoutIcon />, to: "/logout" },
  ],
  Admin: [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { text: "Graduate Management", icon: <PeopleIcon />, to: "/graduates" },
    { text: "Employer Management", icon: <ContactsIcon />, to: "/employers" },
    { text: "Settings", icon: <PieChartIcon />, to: "/settings" },
    { text: "Logout", icon: <LogoutIcon />, to: "/logout" },
  ],
  jobseeker: [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/job-seeker-dashboard" },
    { text: "Profile", icon: <PersonIcon />, to: "/profile" },
    { text: "Interview History", icon: <HistoryIcon />, to: "/interviews" },
    { text: "Logout", icon: <LogoutIcon />, to: "/logout" },
  ],
  employer: [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/employer-dashboard" },
    { text: "Profile", icon: <PersonIcon />, to: "/profile" },
    { text: "Find Candidates", icon: <SearchIcon />, to: "/search/skill" },
    { text: "Recruitment Pipeline", icon: <GroupIcon />, to: "/recruitment/pipeline" },
    { text: "Company Profile", icon: <BusinessIcon />, to: "/employer/profile" },
    { text: "Recruitement History", icon: <HistoryIcon />, to: "/interviews" },
    { text: "Logout", icon: <LogoutIcon />, to: "/logout" },
  ]
};

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ isSidebar = true }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();

  // Get menu items based on user role
  const menuItems = roleBasedMenuItems[user?.role || "admin"];

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

  // Choose avatar color based on role
  const getAvatarColor = () => {
    switch (user?.role) {
      case "jobseeker":
        return colors.blueAccent[500];
      case "admin":
      case "superAdmin":
        return colors.greenAccent[500];
      case "employer":
        return colors.redAccent[500];
      default:
        return colors.grey[500];
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

          <Avatar
            alt={getFullName()}
            sx={{
              width: collapsed ? 40 : 100,
              height: collapsed ? 40 : 100,
              bgcolor: getAvatarColor(),
              fontSize: collapsed ? "1rem" : "2rem",
              mb: collapsed ? 0 : 1,
            }}
          >
            {getInitials()}
          </Avatar>

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
