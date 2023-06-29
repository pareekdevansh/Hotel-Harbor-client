import React, { useState, useEffect } from "react";
import { Typography, Stack, Box, Card, CardContent } from "@mui/material";
import axios from "axios";
const myBookings = [
  {
    id: 1,
    hotelName: "Hotel A",
    type: "Deluxe",
    fromDate: "2023-06-28",
    toDate: "2023-06-30",
    bookingTime: "2023-06-25T10:30:00",
  },
  {
    id: 2,
    hotelName: "Hotel B",
    type: "Standard",
    fromDate: "2023-07-05",
    toDate: "2023-07-10",
    bookingTime: "2023-07-01T15:45:00",
  },
  // Add more booking data as needed
];
function MyBookingsScreen() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    try {
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
      getBookingFromUserId();
    } catch (error) {
      console.log(error);
    }
  }, []);

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

      <div>
        <Box>
          <Typography variant="h4" gutterBottom align="left">
            My Bookings
          </Typography>
          {myBookings.map((booking) => (
            <Card
              key={booking.id}
              variant="outlined"
              sx={{
                m: "10px",
                padding: "4px",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" align="left">
                  {booking.hotelName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  align="left"
                >
                  Room Type: {booking.type}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  align="left"
                >
                  Check-in: {booking.fromDate} - Check-out: {booking.toDate}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  align="left"
                >
                  Booking Time: {new Date(booking.bookingTime).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </div>
    </Box>
  );
}

export default MyBookingsScreen;
