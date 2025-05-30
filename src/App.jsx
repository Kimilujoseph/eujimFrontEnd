import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AuthLayout from "./layouts/authLayout";
import MainLayout from "./layouts/mainLayout";
import Login from "./auth/Login";
import Graduates from "./scenes/graduates/index";
import Dashboard from "./scenes/dashboard/index";
import ProtectedRoute from "./auth/protectedRoute";
import { AuthProvider } from "./auth/authContext";
import JobSeekerProfile from "./scenes/jobseekerProfile";
import SettingsUserProfile from "./scenes/settings/index";
function App() {
  const [theme, colorMode] = useMode();

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/graduates" element={<Graduates />} />
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/user/:id/profile"
                        element={<JobSeekerProfile />}
                      />
                      <Route
                        path="/settings"
                        element={<SettingsUserProfile />}
                      />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
