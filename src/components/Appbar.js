import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/material";

export default function MenuAppBar({ refreshAppBar }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  async function getSignedInUserDetails() {
    const user = await JSON.parse(localStorage.getItem("currentUser"));
    if (user?.name && user?.email) setUser(user);
    console.log(user);
  }

  useState(() => {
    console.log("##@@called useEffect from menubar");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setUser(user);
  }, [refreshAppBar]);

  const onNavigateToMyBookings = () => {
    navigate("/bookings");
    setAnchorEl(null);
  };
  const handleHomeClick = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setUser(user);
    if (user === null) {
      navigate("/login");
    } else {
      navigate("/home");
    }
  };
  const onNavigateToAdminPanel = () => {
    navigate("/admin");
    setAnchorEl(null);
  };

  const onNavigateToUserProfile = () => {
    navigate("/profile");
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function onLogOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    handleClose();
    navigate("/login");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            float="flex-start"
            sx={{
              cursor: "pointer",
              "&:hover": {},
            }}
            onClick={handleHomeClick}
          >
            Hotel Harbor
          </Typography>

          {!user?.email > 0  || !user?.name > 0 ? (
            <Stack ml={"auto"} direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body1"
                component="div"
                sx={{
                  flexGrow: 1,
                  cursor: "pointer",
                  "&:hover": {},
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </Typography>

              <Typography
                variant="body1"
                onClick={() => navigate("/login")}
                sx={{
                  flexGrow: 1,
                  cursor: "pointer",
                  "&:hover": {},
                }}
              >
                Login
              </Typography>
            </Stack>
          ) : (
            <Stack ml={"auto"} direction="row" spacing={1} alignItems="center">
              <Typography variant="body1">{user?.name}</Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={onNavigateToUserProfile}>Profile</MenuItem>
                <MenuItem onClick={onNavigateToMyBookings}>
                  My Bookings
                </MenuItem>
                {user?.isAdmin && (
                  <MenuItem onClick={onNavigateToAdminPanel}>
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={onLogOut}>Log Out</MenuItem>
              </Menu>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
