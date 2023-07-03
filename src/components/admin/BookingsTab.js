import React, { useEffect, useState, useRef } from "react";
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
  Autocomplete,
  Box,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Loader from "../Loader";
import Error from "../Error";
import dayjs from "dayjs";

import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import BasicDatePicker from "../Datepicker";

const BookingsTab = () => {
  const navigate = useNavigate();
  const TableContainer = styled("div")({
    overflowX: "auto",
  });

  // list of bookings
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;

  // dialog state
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const getAllBookingsRef = useRef();
  const getRoomIdsRef = useRef();
  const getUserIdsRef = useRef();
  const bookingStatusOptions = ["Booked", "Pending", "Cancelled"];
  const [roomIds, setRoomIds] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [formData, setFormData] = useState({
    roomId: "",
    roomName: "",
    userId: "",
    checkInDate: "",
    checkOutDate: "",
    status: "",
  });
  const handleDateChange = (date) => {
    const [checkInDate, checkOutDate] = date;

    setFormData((prevFormData) => ({
      ...prevFormData,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    }));
  };
  const checkCurrentUserAdminAccess = () => {
    const isAdmin = JSON.parse(localStorage.getItem("currentUser"))?.isAdmin;
    if (!isAdmin) {
      setError("You don't have admin access !!");
      setTimeout(() => {
        navigate("/profile");
      }, errorDuration);
      return false;
    }
    return true;
  };
  useEffect(() => {
    // Fetch bookings data from the server
    let isCancelled = false;

    const getAllBookings = async () => {
      if (!isCancelled && !checkCurrentUserAdminAccess) {
        return;
      }
      setLoading(true);
      try {
        console.log("calling booking endpoint ");
        const response = await axios.get("/api/admin/bookings");
        console.log("bookings[] : ", bookings);
        if (!isCancelled) setBookings(response.data);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error.message);
      }
      setLoading(false);
    };
    const getRoomIdsList = async () => {
      if (!isCancelled && !checkCurrentUserAdminAccess) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/rooms");
        const roomIdsList = await response.data.map((room) => room._id);
        if (!isCancelled) setRoomIds(roomIdsList);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    const getUserIdsList = async () => {
      if (!isCancelled && !checkCurrentUserAdminAccess) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/users");
        const userIdsList = await response.data.map((user) => user._id);
        if (!isCancelled) setUserIds(userIdsList);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    getAllBookings();
    getRoomIdsList();
    getUserIdsList();
    if (!isCancelled) {
      getAllBookingsRef.current = getAllBookings();
      getRoomIdsRef.current = getRoomIdsList();
      getUserIdsRef.current = getUserIdsList();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleOpenDialog = (booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setFormData({
        roomId: booking.roomId,
        userId: booking.userId,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        status: booking.status,
      });
    } else {
      setSelectedBooking(null);
      setFormData({
        roomId: "",
        roomName: "",
        userId: "",
        checkInDate: "",
        checkOutDate: "",
        status: "",
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const callGetAllBookings = () => {
    if (getAllBookingsRef) {
      getAllBookingsRef.current();
    }
  };
  const callGetRoomIds = () => {
    if (getRoomIdsRef) {
      getRoomIdsRef.current();
    }
  };
  const callGetUserIds = () => {
    if (getUserIdsRef) {
      getUserIdsRef.current();
    }
  };
  const handleDelete = async (bookingId) => {
    if (!checkCurrentUserAdminAccess) {
      return;
    }
    // Delete booking from the server
    setLoading(true);
    try {
      const deleteBooking = await axios.delete(
        `/api/admin/bookings/${bookingId}`
      );
      console.log("delete booking response: ", deleteBooking.data);
      callGetAllBookings();
      callGetRoomIds();
      callGetUserIds();
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };
  const isFormDataEmpty = () => {
    return (
      !formData.roomId ||
      !formData.userId ||
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !formData.status
    );
  };
  const handleSave = async () => {
    if (!checkCurrentUserAdminAccess) {
      return;
    }
    console.log("data forms: ", formData);
    if (isFormDataEmpty() && (selectedBooking || !formData.roomName)) {
      setError("Pleas Fill Booking Data First!!");
      return;
    }
    setLoading(true);
    console.log("handleSave function: ", selectedBooking);
    // Save or update booking data on the server
    try {
      if (selectedBooking) {
        const booking = {
          roomId: formData.roomId,
          userId: formData.userId,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          status: formData.status,
        };
        const updatedBooking = await axios.put(
          `/api/admin/bookings/${selectedBooking._id}`,
          booking
        );
        console.log("Updated booking:", updatedBooking.data);
      } else {
        const booking = {
          roomId: formData.roomId,
          roomName: formData.roomName,
          userId: formData.userId,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          status: formData.status,
        };
        console.log("call to new booking function");
        const newBooking = await axios.post("/api/admin/bookings", booking);
        console.log("New booking:", newBooking.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error saving booking: ", error);
      setLoading(false);
      setError(error.message);
    }
    callGetAllBookings();
    callGetRoomIds();
    callGetUserIds();
    handleCloseDialog();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    console.log("Selected name: ", name);
    console.log("Selected value: ", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log("Updated formData: ", formData);
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Booking Id</TableCell>
                  <TableCell>Room Id</TableCell>
                  <TableCell>RoomName</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>CheckInDate</TableCell>
                  <TableCell>CheckOutDate</TableCell>
                  <TableCell>Booking Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 &&
                  bookings.map((booking, index) => (
                    <TableRow key={booking._id}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{booking._id}</TableCell>
                      <TableCell>{booking.roomId}</TableCell>
                      <TableCell>{booking.roomName}</TableCell>
                      <TableCell>{booking.userId}</TableCell>
                      <TableCell>
                        {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        {dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(booking)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(booking._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {(selectedBooking ? "Edit" : "Add") + " Booking"}
        </DialogTitle>
        <DialogContent>
          <Stack direction={"column"} spacing={2} mt={1} mb={1}>
            <TextField
              label="RoomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleFormChange}
            />
            {!selectedBooking && (
              <TextField
                label="Room Name"
                name="roomName"
                value={formData.roomName}
                onChange={handleFormChange}
              />
            )}
            <TextField
              label="UserId"
              name="userId"
              value={formData.userId}
              onChange={handleFormChange}
            />
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
            />
            {/* <Autocomplete
              disablePortal
              id="roomId-autocomplete"
              options={roomIds}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="RoomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleFormChange}
                />
              )}
            />
            <Autocomplete
              disablePortal
              id="userId-autocomplete"
              options={userIds}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="UserId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleFormChange}
                />
              )}
            /> */}
            <BasicDatePicker
              checkInDate={dayjs(formData.checkInDate)}
              checkOutDate={dayjs(formData.checkOutDate)}
              onDateSelected={handleDateChange}
            />
            {/* <Autocomplete
              disablePortal
              id="status-autocomplete"
              options={bookingStatusOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                />
              )}
            /> */}
          </Stack>
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
