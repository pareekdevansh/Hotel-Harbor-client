import React, { useState, useEffect, useRef } from "react";
import { Typography, Stack, Box, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookedRoom from "../components/BookedRoom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
function MyBookingsScreen({ handleAppBarRefresh }) {
  const navigate = useNavigate();
  // list of bookings done by user's email
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const duration = 3000;
  const getBookingsFromEmailRef = useRef();

  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        console.log("login related error  ");
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        handleAppBarRefresh();
        navigate("/login");
      }
    }, duration);
  };

  useEffect(() => {
    let isCancelled = false;
    const getBookingsFromEmail = async () => {
      try {
        setLoading(true);
        const email = JSON.parse(localStorage.getItem("currentUser"))?.email;
        if (!email) {
          showError("Please Login First", true);
          return;
        }
        console.log("before making function call");
        const bookingsList = (
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/bookings/getbookigsfromemail`,
            {
              email: email,
            }
          )
        ).data;
        bookingsList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log("bookings list : ", bookingsList);
        if (!isCancelled) {
          setBookings(bookingsList);
        }
      } catch (error) {
        setBookings([]);
        console.log("getBookingsFromEmail error is : ", JSON.stringify(error));
        setError("Something went wrong");
      }
      setLoading(false);
    };
    getBookingsFromEmail();
    if (!isCancelled) {
      getBookingsFromEmailRef.current = getBookingsFromEmail();
    }
    return () => {
      isCancelled = true;
    };
  }, []);
  const refreshPage = async () => {
    setSuccess(true);
    if (getBookingsFromEmailRef.current) {
      await getBookingsFromEmailRef.current();
      setSuccess(false);
    }
  };
  return (
    <Box>
      <Typography variant="h3">My Bookings</Typography>
      <Stack direction={"column"} spacing={2}>
        {loading && <Loader />}
        {error && <Error errorMessage={error} />}
        {!loading && !error && bookings.length > 0 && success && (
          <Success message={error} />
        )}
        {bookings?.map((booking) => {
          return (
            <BookedRoom
              booking={booking}
              refreshPage={refreshPage}
              showError={showError}
              key={booking._id}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default MyBookingsScreen;
