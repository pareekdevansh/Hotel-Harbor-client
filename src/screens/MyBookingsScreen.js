import React, { useState, useEffect } from "react";
import { Typography, Stack, Box } from "@mui/material";
import axios from "axios";
function MyBookingsScreen() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    try {
      getBookingFromUserId();
    } catch (error) {
      console.log(error);
    }
  }, []);
  async function getBookingFromUserId() {
    const user = await JSON.parse(localStorage.getItem("currentUser"));
    setUser(user);
    const userId = user?._id;
    if (userId === null || userId === undefined) {
      throw new Error("User is not logged in");
    }
    const bookings = (
      await axios.post("/api/bookings/getbookingsbyuserid", {
        userId: userId,
      })
    ).data;
    setBookings(bookings);
  }
  return (
    <Box>
      <Typography variant="h3">My Bookings</Typography>
      <Stack direction={"column"} spacing={2}>
        {bookings.map((booking) => {
          return (
            <Typography variant="h5">{JSON.stringify(booking)}</Typography>
          );
        })}
      </Stack>
    </Box>
  );
}

export default MyBookingsScreen;
