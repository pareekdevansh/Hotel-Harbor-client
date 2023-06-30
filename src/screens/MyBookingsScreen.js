import React, { useState, useEffect } from "react";
import { Typography, Stack, Box, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        //TODO: uncomment
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
