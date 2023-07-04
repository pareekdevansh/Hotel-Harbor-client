import React, { useState, useEffect } from "react";
import { Typography, Stack, Box, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookedRoom from "../components/BookedRoom";
require("dotenv").config();
function MyBookingsScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    }, duration);
  };
  useEffect(() => {
    let isCancelled = false;
    const getBookingsFromEmail = async (email) => {
      try {
        setLoading(true);
        const email = JSON.parse(localStorage.getItem("currentUser"))?.email;
        if (!email) {
          showError("Please Login First", true);
          return;
        }
        const bookings = (
          await axios.post( `${process.env.SERVER_URL}/api/bookings/getbookigsfromemail`, {
            email: email,
          })
        ).data;
        bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log("bookings list : ", bookings);
        if (!isCancelled) {
          setBookings(bookings);
        }
      } catch (error) {
        setBookings([]);
        console.log("getBookingsFromEmail error is : ", JSON.stringify(error));
        setError(error.message || "Something went wrong");
      }
    };
    getBookingsFromEmail();
    return () => {
      isCancelled = true;
    };
  }, []);

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
