import React, { useEffect, useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Loader from "../Loader";
import Error from "../Error";
import dayjs from "dayjs";

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Fetch bookings data from the server
    const getAllBookings = async () => {
      setLoading(true);
      try {
        console.log("calling booking endpoint ");
        const response = await axios.get("/api/admin/bookings");
        console.log("bookings[] : ", bookings);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error.message);
      }
    };
    getAllBookings();
  }, []);

  const handleOpenDialog = (booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setFormData({
        name: booking.name,
        description: booking.description,
      });
    } else {
      setSelectedBooking(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async (bookingId) => {
    // Delete booking from the server
    setLoading(true);
    try {
      const deleteBooking = await axios.delete(
        `/api/admin/bookings/${bookingId}`
      );
      console.log("delete booking response: ", deleteBooking.data);
      const updatedBookingsList = await bookings.filter(
        (booking) => booking.id !== bookingId
      );
      setBookings(updatedBookingsList);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Save or update booking data on the server
    try {
      if (selectedBooking) {
        const newBooking = axios.put(
          `/api/admin/bookings/${selectedBooking._id}`,
          formData
        );
        console.log("newBooking: ", newBooking.data);
        const updatedBookingsList = bookings.map((booking) => {
          if (booking._id === selectedBooking._id) {
            return newBooking.data;
          } else {
            return booking;
          }
        });
        setBookings(updatedBookingsList);
      } else {
        const newBooking = axios.post("/api/admin/bookings", formData);
        console.log("newBooking: ", newBooking.data);
        const updatedBookingsList = [...bookings, newBooking.data];
        setBookings(updatedBookingsList);
      }
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
      setLoading(false);
      setError(error.response.data.error);
    }

    handleCloseDialog();
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {error ? (
        <>
          <Error errorMessage={error} />
          {setTimeout(() => {
            setError("");
          }, errorDuration)}
        </>
      ) : loading ? (
        <Loader />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog(null)}
          >
            Add Booking
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>RoomName</TableCell>
                <TableCell>RoomId</TableCell>
                <TableCell>UserId</TableCell>
                <TableCell>CheckInDate</TableCell>
                <TableCell>CheckOutDate</TableCell>
                <TableCell>Booking Time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length &&
                bookings.map((booking, index) => (
                  <TableRow key={booking._id}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>{booking._id}</TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell>{booking.roomId}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>
                      {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(booking)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(booking.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}
      {/* Booking Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedBooking ? "Edit Booking" : "Add Booking"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            {selectedBooking ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingsTab;
