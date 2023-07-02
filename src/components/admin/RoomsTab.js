import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
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
  IconButton,
  styled,
} from "@mui/material";
import axios from "axios";
import Loader from "../Loader";
import Error from "../Error";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const RoomsTab = () => {
  const navigate = useNavigate();
  const TableContainer = styled("div")({
    overflowX: "auto",
  });
  const getAllRoomsRef = useRef();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // name , maxCount , phoneNumber , email , rentPerDay, roomType , description

  const [formData, setFormData] = useState({
    name: "",
    maxCount: "",
    phoneNumber: "",
    email: "",
    rentPerDay: "",
    roomType: "",
    description: "",
  });
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
    let isCancelled = false;
    const getAllRooms = async () => {
      setLoading(true);
      try {
        console.log("calling room endpoint ");
        const response = (await axios.get("/api/admin/rooms/")).data;
        console.log("rooms[] : ", response);
        if (!isCancelled) setRooms(response);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
      setLoading(false);
    };
    getAllRooms();

    if (!isCancelled) {
      getAllRoomsRef.current = getAllRooms();
    }
    return () => {
      isCancelled = false;
    };
  }, []);
  const fillFormData = (room) => {
    setFormData({
      name: room.name,
      maxCount: room.maxCount,
      phoneNumber: room.phoneNumber,
      email: room.email,
      rentPerDay: room.rentPerDay,
      imageUrl: room.imageUrl,
      roomType: room.roomType,
      description: room.description,
    });
  };

  const clearFormData = () => {
    setFormData({
      name: "",
      maxCount: "",
      phoneNumber: "",
      email: "",
      rentPerDay: "",
      imageUrl: [],
      roomType: "",
      description: "",
    });
  };
  const handleFieldChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...formData.imageUrl];
    updatedLinks[index] = value;
    handleFieldChange("imageUrl", updatedLinks);
  };

  const handleAddLink = () => {
    const links = [...formData.imageUrl, ""];
    handleFieldChange("imageUrl", links);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = [...formData.imageUrl];
    updatedLinks.splice(index, 1);
    handleFieldChange("imageUrl", updatedLinks);
  };
  const handleOpenDialog = (room) => {
    if (room) {
      setSelectedRoom(room);
      fillFormData(room);
    } else {
      setSelectedRoom(null);
      clearFormData();
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    clearFormData();
    setOpen(false);
  };
  const callGetAllRooms = () => {
    if (getAllRoomsRef) {
      getAllRoomsRef.current();
    }
  }
  const handleDelete = async (roomId) => {
    if (!checkCurrentUserAdminAccess()) return;
    // Delete room from the server
    setLoading(true);
    try {
      const deleteRoom = await axios.delete(`/api/admin/rooms/${roomId}`);
      console.log("delete room response: ", deleteRoom.data);
      callGetAllRooms()
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const areFieldsEmpty = () => {
    // remote empty links from formData
    const imageUrl = formData.imageUrl.filter((link) => {
      return link.length > 0;
    });
    handleFieldChange("imageUrl", imageUrl);
    return !formData.name || !formData.roomType || !formData.description;
  };

  const handleSave = async () => {
    if (!checkCurrentUserAdminAccess)
      return
    if (areFieldsEmpty()) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    // Save or update room data on the server
    try {
      const roomData = {
        name: formData.name,
        maxCount: formData.maxCount,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        rentPerDay: formData.rentPerDay,
        imageUrl: formData.imageUrl,
        roomType: formData.roomType,
        description: formData.description,
      };
      if (selectedRoom) {
        const newRoom = await axios.put(
          `/api/admin/rooms/${selectedRoom._id}`,
          roomData
        );
        console.log("newRoom: ", newRoom.data);
      } else {
        const newRoom = await axios.post("/api/admin/rooms", roomData);
        console.log("newRoom: ", newRoom.data);
      }
      callGetAllRooms();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
    setLoading(false);
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
            Add Room
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Phone Number </TableCell>
                <TableCell>Email </TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Room Type </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.length &&
                rooms.map((room, index) => (
                  <TableRow key={room._id}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>{room._id}</TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.maxCount}</TableCell>
                    <TableCell>{room.phoneNumber}</TableCell>
                    <TableCell>{room.email}</TableCell>
                    <TableCell>{room.rentPerDay}</TableCell>
                    <TableCell>{room.roomType}</TableCell>

                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenDialog(room)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        variant="outlined"
                        onClick={() => handleDelete(room._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{(selectedRoom ? "Edit" : "Add") + " Room"}</DialogTitle>
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
            autoFocus
            margin="dense"
            name="maxCount"
            label="Capacity"
            fullWidth
            value={formData.maxCount}
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="phoneNumber"
            label="Phone No."
            fullWidth
            value={formData.phoneNumber}
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="rentPerDay"
            label="Rent Per Day"
            fullWidth
            value={formData.rentPerDay}
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="roomType"
            label="Room Type"
            fullWidth
            value={formData.roomType}
            onChange={handleFormChange}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="h2">
              Insert New Room Image Url
            </Typography>
            <IconButton onClick={handleAddLink}>
              <AddCircleOutlineIcon />
            </IconButton>
          </div>

          {formData?.imageUrl?.map((link, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={link}
                fullWidth
                onChange={(e) => handleLinkChange(index, e.target.value)}
              />
              <IconButton onClick={() => handleRemoveLink(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}

          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            {selectedRoom ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomsTab;
