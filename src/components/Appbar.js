import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState, useEffect } from "react";
import CheckoutSuccess from "./PaymentSuccess";
export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setuser] = useState(null);

  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("currentUser")));
  }, []);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };
  const onNavigateToMyBookings = () => {
    window.location.href = "/bookings";
  };
  const onNavigateToUserProfile = () => {
    window.location.href = "/profile";
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function onLogOut() {
    // TODO show loading
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Typography
            variant="h6"
            textAlign={"start"}
            component="div"
            onClick={() => (window.location.href = "/home")}
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              "&:hover": {
                // textDecoration: "underline",
              },
            }}
          >
            Hotel Harbor
          </Typography>

          {auth && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Typography variant="body1">{user?.name}</Typography>
              </div>
              <div>
                <IconButton
                  size="large"
                  textAlign={"end"}
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
                  <MenuItem onClick={onLogOut}>Log Out</MenuItem>
                </Menu>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
