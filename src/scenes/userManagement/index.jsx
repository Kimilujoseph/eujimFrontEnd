// components/UserManagementTable.jsx
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  LinearProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Button,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as VerifiedIcon,
  Pending as PendingIcon,
  Block as SuspendedIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import api from "../../api/api";

const UserManagementTable = ({ role, title, includeDeleted = true }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createErrors, setCreateErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchUsers = debounce(async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/manage/admin/users/all?role=${role}&include_deleted=${includeDeleted}`
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 300);

    fetchUsers();
    return () => fetchUsers.cancel();
  }, [role, includeDeleted]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateErrors({});

    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        role,
        email,
        password,
      });

      setSnackbar({
        open: true,
        message: "User created successfully",
        severity: "success",
      });
      setOpenCreateModal(false);
      // fetchUsers();
      setFirstName("");
      setSecondName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.response?.status === 400) {
        // Handle validation errors
        const backendErrors = err.response.data?.errors || {};
        const formattedErrors = {};
        if (backendErrors.email) {
          formattedErrors.email = backendErrors.email.join(', ');
        }
        if (backendErrors.password) {
          formattedErrors.password = backendErrors.password.join(', ');
        }
        if (backendErrors.firstName) {
          formattedErrors.firstName = backendErrors.firstName.join(', ');
        }
        if (backendErrors.lastName) {
          formattedErrors.lastName = backendErrors.secondName.join(', ');
        }

        // Handle non-field specific errors
        if (err.response.data?.message && !Object.keys(formattedErrors).length) {
          formattedErrors.non_field_errors = err.response.data.message;
        }

        setCreateErrors(formattedErrors);
      } else if (err.response?.data?.error === "Token expired") {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Error creating user",
          severity: "error",
        });
      }
    }
  };


  const handleStatusUpdate = async () => {
    try {
      let endpoint = `/manage/admin/user/${selectedUser.id}/`;
      let method = "post";

      switch (actionType) {
        case "verify":
          endpoint += "toggle-verify";
          break;
        case "delete":
          endpoint += "delete";
          method = "delete";
          break;
        case "restore":
          endpoint += "restore";
          break;
        case "suspend":
          endpoint += "toggle-suspend";
          break;
        default:
          throw new Error("Invalid action type");
      }

      await api[method](endpoint);

      setSnackbar({
        open: true,
        message: getSuccessMessage(),
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error ${getActionLabel()} user`,
        severity: "error",
      });
    }
    setOpenDialog(false);
    setAnchorEl(null);
  };

  const getSuccessMessage = () => {
    switch (actionType) {
      case "verify":
        return `User ${selectedUser.isVerified ? "unverified" : "verified"
          } successfully`;
      case "delete":
        return "User deleted successfully";
      case "restore":
        return "User restored successfully";
      case "suspend":
        return `User ${selectedUser.is_suspended ? "unsuspended" : "suspended"
          } successfully`;
      default:
        return "Action completed successfully";
    }
  };

  const getActionLabel = () => {
    switch (actionType) {
      case "verify":
        return "verifying";
      case "delete":
        return "deleting";
      case "restore":
        return "restoring";
      case "suspend":
        return "suspending";
      default:
        return "processing";
    }
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const getRoleIcon = (role) => {
    switch (role) {
      case "superAdmin":
      case "admin":
        return <AdminIcon />;
      case "employer":
        return <BusinessIcon />;
      case "jobseeker":
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Avatar
            className="w-8 h-8 text-sm"
            sx={{ bgcolor: colors.greenAccent[500] }}
          >
            {params.row.firstName?.charAt(0)}
            {params.row.lastName?.charAt(0)}
          </Avatar>
          <span>
            {params.row.firstName} {params.row.lastName}
            {params.row.is_deleted && " (Deleted)"}
          </span>
        </div>
      ),
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          {getRoleIcon(params.row.role)}
          {params.row.role || "N/A"}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <div className="flex flex-wrap items-center gap-1 mt-1 overflow-visible">
          <Chip
            icon={params.row.isVerified ? <VerifiedIcon /> : <PendingIcon />}
            label={params.row.isVerified ? "Verified" : "Pending"}
            color={params.row.isVerified ? "success" : "warning"}
            size="small"
          />
          <Chip
            icon={
              params.row.is_suspended ? <SuspendedIcon /> : <VerifiedIcon />
            }
            label={params.row.is_suspended ? "Suspended" : "Active"}
            color={params.row.is_suspended ? "error" : "success"}
            size="small"
          />
          {params.row.is_deleted && (
            <Chip
              icon={<DeleteIcon />}
              label="Deleted"
              color="error"
              size="small"
            />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={(e) => handleMenuClick(e, params.row)}
            sx={{ color: colors.grey[100] }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => navigate(`/user/${params.row.id}/profile`)}
            >
              <div className="flex items-center">
                <VisibilityIcon className="mr-2" /> View Profile
              </div>
            </MenuItem>

            {!params.row.is_deleted && [
              <MenuItem
                key="suspend"
                onClick={() => {
                  setActionType("suspend");
                  setSelectedUser(params.row);
                  setOpenDialog(true);
                }}
              >
                <div className="flex items-center">
                  {params.row.is_suspended ? (
                    <VerifiedIcon className="mr-2" />
                  ) : (
                    <SuspendedIcon className="mr-2" />
                  )}
                  {params.row.is_suspended ? "Unsuspend" : "Suspend"}
                </div>
              </MenuItem>,
              <MenuItem
                key="verify"
                onClick={() => {
                  setActionType("verify");
                  setSelectedUser(params.row);
                  setOpenDialog(true);
                }}
              >
                <div className="flex items-center">
                  {params.row.isVerified ? (
                    <PendingIcon className="mr-2" />
                  ) : (
                    <VerifiedIcon className="mr-2" />
                  )}
                  {params.row.isVerified ? "Unverify" : "Verify"}
                </div>
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={() => {
                  setActionType("delete");
                  setSelectedUser(params.row);
                  setOpenDialog(true);
                }}
              >
                <div className="flex items-center">
                  <DeleteIcon className="mr-2" /> Delete
                </div>
              </MenuItem>,
            ]}

            {params.row.is_deleted && (
              <MenuItem
                onClick={() => {
                  setActionType("restore");
                  setSelectedUser(params.row);
                  setOpenDialog(true);
                }}
              >
                <div className="flex items-center">
                  <RestoreIcon className="mr-2" /> Restore
                </div>
              </MenuItem>
            )}
          </Menu>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="m-5">
      <Header
        title={title || `${role.toUpperCase()} MANAGEMENT`}
        subtitle={
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
            <Button
              variant="contained"
              onClick={() => setOpenCreateModal(true)}
              sx={{
                background: colors.greenAccent[600],
                color: colors.grey[900],
                "&:hover": { background: colors.greenAccent[700] },
              }}
              className="w-full sm:w-auto"
            >
              Create User
            </Button>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: colors.grey[300], mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: colors.grey[100],
                  "& fieldset": { borderColor: colors.grey[700] },
                  "&:hover fieldset": { borderColor: colors.grey[500] },
                },
              }}
              className="w-full sm:w-72"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} user: {selectedUser?.email}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="w-full mt-10 h-[75vh] overflow-x-auto">
        <Dialog
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        >
          <form
            onSubmit={handleCreateUser}
            className="p-6 min-w-[90vw] sm:min-w-[400px]"
            style={{ background: colors.primary[400] }}
          >
            <DialogTitle className="text-center" style={{ color: colors.grey[100] }}>
              Create New User
            </DialogTitle>
            <DialogContent>
              {createErrors.non_field_errors && (
                <Alert severity="error" className="mb-4">
                  {createErrors.non_field_errors}
                </Alert>
              )}

              <TextField
                fullWidth
                margin="normal"
                variant="filled"
                label="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!createErrors.firstName}
                helperText={createErrors.firstName}
                InputLabelProps={{ style: { color: colors.grey[300] } }}
                sx={{
                  input: { color: colors.grey[100] },
                  background: colors.primary[500],
                }}
                className="mt-4"
              />

              <TextField
                fullWidth
                margin="normal"
                variant="filled"
                label="Second Name"
                required
                value={lastName}
                onChange={(e) => setSecondName(e.target.value)}
                error={!!createErrors.lastName}
                helperText={createErrors.lastName}
                InputLabelProps={{ style: { color: colors.grey[300] } }}
                sx={{
                  input: { color: colors.grey[100] },
                  background: colors.primary[500],
                }}
                className="mt-4"
              />

              <TextField
                fullWidth
                margin="normal"
                variant="filled"
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!createErrors.email}
                helperText={createErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon
                        sx={{ color: colors.greenAccent[400] }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: colors.grey[300] } }}
                sx={{
                  input: { color: colors.grey[100] },
                  background: colors.primary[500],
                }}
                className="mt-4"
              />

              <TextField
                fullWidth
                margin="normal"
                variant="filled"
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!createErrors.password}
                helperText={createErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: colors.greenAccent[400] }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: colors.grey[300] } }}
                sx={{
                  input: { color: colors.grey[100] },
                  background: colors.primary[500],
                }}
                className="mt-4"
              />
            </DialogContent>
            <DialogActions className="flex justify-center pb-0">
              <Button
                onClick={() => setOpenCreateModal(false)}
                style={{ color: colors.grey[300] }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: colors.greenAccent[600],
                  color: colors.grey[900],
                  "&:hover": { background: colors.greenAccent[700] },
                }}
              >
                Create User
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            loadingOverlay: LinearProgress,
            toolbar: () => (
              <div className="p-2">
                <Button
                  startIcon={<SearchIcon />}
                  onClick={() => fetchUsers()}
                  sx={{ color: colors.grey[100] }}
                >
                  Refresh
                </Button>
              </div>
            ),
          }}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserManagementTable;