import React, { useState , useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function UserProfile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const duration = 3000;
  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        console.log("login related error  ");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }, duration);
  };
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        let authToken = localStorage.getItem("authToken");
        if (!authToken) {
          showError("Please Login First", true);
        }
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        console.log("before calling getUserDetails API");
        const response = await axios.get("/api/users/getuserdetails", config);
        setUserDetails(response.data);
        console.log("user details are : ", userDetails);
        setLoading(false);
      } catch (error) {
        console.log("getUserDetails error is : ", JSON.stringify(error));
        let login =
          error.response.data.error === "No User Found" || "Please Login First";
        showError(error.response.data.error, login);
      }
    };

    getUserDetails();
  }, []);
  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 400, margin: "0 auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Name: {userDetails?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Email: {userDetails?.email}
        </Typography>
        <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserProfile;
