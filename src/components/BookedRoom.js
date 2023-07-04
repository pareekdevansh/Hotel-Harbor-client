import { Card, CardContent, Typography, Button } from "@mui/material";
import React from "react";
import dayjs from "dayjs";
import axios from "axios";
function BookedRoom({ booking, refreshPage, showError }) {
  const dateFormat = "DD/MM/YYYY";
  const dateTimeFormat = "DD/MM/YYYY hh:mm A";
  dayjs.locale("en");

  const handleConfirmBooking = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/bookroom`,
        { id }
      );
      console.log(response.data);
      setTimeout(() => {
        refreshPage();
      }, 2000);
    } catch (error) {
      showError(error.response.data.error, false);
    }
  };
  return (
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
          Room name : {booking.roomName}
        </Typography>
        {/* <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 1 }}
          align="left"
        >
          Room Type: {booking.type}
        </Typography> */}
        <Typography variant="subtitle1" color="text.secondary" align="left">
          Check-in: {dayjs(booking.checkInDate).format(dateFormat)}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="left">
          Check-out: {dayjs(booking.checkOutDate).format(dateFormat)}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="left">
          Booking Time: {new dayjs(booking.updatedAt).format(dateTimeFormat)}
        </Typography>
        {booking.status === "Pending" && (
          <>
            <Button
              variant="outlined"
              onClick={() => handleConfirmBooking(booking._id)}
            >
              <Typography
                variant="subtitle1"
                color="text.secondary"
                align="left"
              >
                Confirm Booking
              </Typography>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default BookedRoom;
