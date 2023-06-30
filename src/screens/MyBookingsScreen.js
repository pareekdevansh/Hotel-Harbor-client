import React, { useState, useEffect } from "react";
import { Typography, Stack, Box, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookedRoom from "../components/BookedRoom";
function MyBookingsScreen() {
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
    const getBookingsFromEmail = async (email) => {
      try {
        if (email) {
          const bookings = (
            await axios.post("/api/bookings/getbookigsfromemail", {
              email: email,
            })
          ).data;
          console.log("bookings list : ", bookings);
          setBookings(bookings);
        } else {
          throw new Error("User is not logged in");
        }
      } catch (error) {
        console.log("getBookingsFromEmail error is : ", JSON.stringify(error));
        setError(error.message || "Something went wrong");
      }
    };
    const getUserDetails = async () => {
      try {
        setLoading(true);
        let authToken = localStorage.getItem("authToken");
        if (!authToken) {
          showError("Please Login First", true);
          return;
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
        console.log("before calling getBookingsFromEmail");
        await getBookingsFromEmail(userDetails?.email);

        setLoading(false);
      } catch (error) {
        console.log("getUserDetails error is : ", JSON.stringify(error));
        let login =
          error.response.data.error === "No User Found" || "Please Login First";
        showError(error.response.data.error, login);
      }
    };
    getUserDetails();
  }, [userDetails]);

  return (
    <Box>
      <Typography variant="h3">My Bookings</Typography>
      <Stack direction={"column"} spacing={2}>
        {bookings.map((booking) => {
          return <BookedRoom booking={booking} key={booking._id} />;
        })}
      </Stack>
    </Box>
  );
}

export default MyBookingsScreen;
