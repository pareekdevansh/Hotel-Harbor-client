import React, { useEffect, useState } from "react";
import {
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
} from "@mui/material";
import axios from "axios";
import Loader from "../Loader";
import Error from "../Error";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RoomsTab = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Fetch rooms data from the server
    const getAllRooms = async () => {
      setLoading(true);
      try {
        console.log("calling room endpoint ");
        const response = await axios.get("/api/admin/rooms/");
        console.log("rooms[] : ", rooms);
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error.message);
      }
    };
    getAllRooms();
  }, []);

  const handleOpenDialog = (room) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        name: room.name,
        description: room.description,
      });
    } else {
      setSelectedRoom(null);
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

  const handleDelete = async (roomId) => {
    // Delete room from the server
    setLoading(true);
    try {
      const deleteRoom = await axios.delete(`/api/admin/rooms/${roomId}`);
      console.log("delete room response: ", deleteRoom.data);
      const updatedRoomsList = await rooms.filter((room) => room.id !== roomId);
      setRooms(updatedRoomsList);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Save or update room data on the server
    try {
      if (selectedRoom) {
        const newRoom = axios.put(
          `/api/admin/rooms/${selectedRoom._id}`,
          formData
        );
        console.log("newRoom: ", newRoom.data);
        const updatedRoomsList = rooms.map((room) => {
          if (room._id === selectedRoom._id) {
            return newRoom.data;
          } else {
            return room;
          }
        });
        setRooms(updatedRoomsList);
      } else {
        const newRoom = axios.post("/api/admin/rooms", formData);
        console.log("newRoom: ", newRoom.data);
        const updatedRoomsList = [...rooms, newRoom.data];
        setRooms(updatedRoomsList);
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
            Add Room
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Sr No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>RoomName</TableCell>
                <TableCell>Max Count </TableCell>
                <TableCell>Rent</TableCell>
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
                    <TableCell>{room.rentPerDay}</TableCell>

                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenDialog(room)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        variant="outlined"
                        onClick={() => handleDelete(room.id)}
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

      {/* Room Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedRoom ? "Edit Room" : "Add Room"}</DialogTitle>
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
            {selectedRoom ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomsTab;
