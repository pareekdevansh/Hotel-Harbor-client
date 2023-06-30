import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import dayjs from "dayjs";
function BookedRoom({ booking }) {
  const dateFormat = "DD/MM/YYYY";
  const dateTimeFormat = "DD/MM/YYYY hh:mm A";
  dayjs.locale("en");

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
      </CardContent>
    </Card>
  );
}

export default BookedRoom;
