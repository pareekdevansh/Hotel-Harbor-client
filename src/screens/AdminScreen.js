import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Typography } from "@mui/material";
import BookingsTab from "../components/admin/BookingsTab";
import UsersTab from "../components/admin/UsersTab";
import RoomsTab from "../components/admin/RoomsTab";
import axios from "axios";
const AdminScreen = ({ handleAppBarRefresh }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();
  const duration = 3000;
  const [adminAccess, setAdminAccess] = useState(false);
  const logOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    handleAppBarRefresh();
    navigate("/login");
  };
  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        logOut();
      }
    }, duration);
  };

  useEffect(() => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showError("Please Login First", true);
      return;
    } else {
      const isAdmin = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        };
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/private`,
            config
          );
          console.log("response is ", response.data);
          localStorage.setItem("currentUser", JSON.stringify(response.data));
          const user = JSON.parse(localStorage.getItem("currentUser"));
          // since now admin access may be granted
          handleAppBarRefresh();
          setAdminAccess(user?.isAdmin);
        } catch (error) {
          console.log(
            "getUserPrivateDetails: error is : ",
            JSON.stringify(error)
          );
          let login =
            error?.response?.data?.error === "No User Found" ||
            "Please Login First";
          showError(
            error?.response?.data?.error || "Something went wrong",
            login
          );
        }
      };
      isAdmin();
    }
    setLoading(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      {!adminAccess ? (
        <Typography padding={3} variant="h4" gutterBottom>
          You Do not have admin Access!!
        </Typography>
      ) : (
        <Tabs value={activeTab} onChange={handleTabChange}>
          {activeTab === 0 && <BookingsTab />}
          {activeTab === 1 && <UsersTab />}
          {activeTab === 2 && <RoomsTab />}
          <Tab label="Booking" />
          <Tab label="User" />
          <Tab label="Room" />
        </Tabs>
      )}
    </div>
  );
};

export default AdminScreen;
