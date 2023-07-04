import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function UserProfile({ handleAppBarRefresh }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const duration = 3000;
  const showError = (message, login) => {
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        handleLogout();
      }
    }, duration);
  };
  useEffect(() => {
    const getUserDetails = async () => {
      let user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        showError("Please Login First", true);
        return;
      }
      setUser(user);
    };

    getUserDetails();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    handleAppBarRefresh();
    navigate("/login");
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 400, margin: "0 auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        {user && (
          <>
            <Typography variant="subtitle1" color="text.secondary">
              Name: {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Email: {user?.email}
            </Typography>
            <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
              Logout
            </Button>
          </>
        )}
        {!user && (
          <Typography variant="subtitle1" color="error">
            Session Timeout!!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default UserProfile;
