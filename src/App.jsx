import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AuthLayout from "./layouts/authLayout";
import MainLayout from "./layouts/mainLayout";
import Login from "./auth/Login";
import UserManagementTable from "./scenes/userManagement/index";
import Logout from "./auth/Logout";
import TokenExpiredPage from "./auth/tokenExpiry";
import ForgotPassword from "./auth/forgotpassword";
import JobSeekerProfile from "./scenes/job_seeker_profile";
import JobSeekerDashboard from "./scenes/JobseekerDashboard/index";
import RecruitmentPipeline from "./components/employer/recruiterPipeline";
import RequestVerificationForm from "./auth/emailVerificationRequest";
import PasswordResetConfirm from "./auth/passworrdReset";
import SkillSearchComponent from "./components/skillSearch";
import EmployerProfile from "./scenes/employerProfile/index";
import AdminDashboard from "./scenes/dashboard/index";
import RecruiterDashboard from "./scenes/employerDashboard/dashboard"
import InterviewHistory from "./scenes/recruitmentHistory/index";
import ProtectedRoute from "./auth/protectedRoute";
import SettingsPage from "./scenes/global/settings"
import JobFeeds from "./scenes/jobFeeds";
import JobPostingManagement from "./scenes/job_posting";
import { AuthProvider } from "./auth/authContext";
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
              path="/token-expired"
              element={
                <AuthLayout>
                  <TokenExpiredPage />
                </AuthLayout>
              }
            />
            <Route
              path="/request-new-verification"
              element={
                <AuthLayout>
                  <RequestVerificationForm purpose="verify" />
                </AuthLayout>
              }
            />
            <Route
              path="/reset-password/:uidb64/:token/"
              element={
                <AuthLayout>
                  <PasswordResetConfirm />
                </AuthLayout>
              }
            />

            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthLayout>
                  <RequestVerificationForm purpose="reset" />
                </AuthLayout>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/graduates" element={<UserManagementTable role="jobseeker" title="JOB SEEKER MANAGEMENT" />} />
                      <Route path="/employers" element={<UserManagementTable role="employer" title="EMPLOYER MANAGEMENT" />} />
                      <Route path="/admin" element={<UserManagementTable role="admin" title="EMPLOYER MANAGEMENT" />} />
                      <Route path="/search/skill" element={<SkillSearchComponent />} />
                      <Route path="/recruitment/pipeline" element={<RecruitmentPipeline />} />
                      <Route path="/recruiter/profile" element={<EmployerProfile />} />
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/profile" element={<JobSeekerProfile />} />
                      <Route path="/employer-dashboard" element={<RecruiterDashboard />} />
                      <Route path="/employer/recruitment-history" element={<InterviewHistory />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/job-feeds" element={<JobFeeds />} />
                <Route path="/job-posting" element={<JobPostingManagement />} />
                      <Route
                        path="/job-seeker-dashboard/"
                        element={<JobSeekerDashboard role='jobseeker' />}
                      />
                      <Route
                        path="/job-seeker-dashboard/:userId?/:firstName?"
                        element={<JobSeekerDashboard role='admin' />}
                      />
                      <Route
                        path="/job-seeker-dashboard/employer-view/:userId?/:firstName?"
                        element={<JobSeekerDashboard role='admin' />}
                      />
                      <Route
                        path="/user/:id/profile"
                        element={<JobSeekerProfile />}
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
