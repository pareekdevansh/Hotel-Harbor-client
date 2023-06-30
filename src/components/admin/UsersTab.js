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
  Checkbox,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Loader from "../Loader";
import Error from "../Error";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    // Fetch users data from the server
    const getAllUsers = async () => {
      setLoading(true);
      try {
        console.log("calling user endpoint ");
        const response = await axios.get("/api/admin/users");
        console.log("users[] : ", response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error.message);
      }
    };
    getAllUsers();
  }, []);

  const handleOpenDialog = (user) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        description: user.description,
      });
    } else {
      setSelectedUser(null);
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

  const handleDelete = async (userId) => {
    // Delete user from the server
    setLoading(true);
    try {
      const deleteUser = await axios.delete(`/api/admin/users/${userId}`);
      console.log("delete user response: ", deleteUser.data);
      const updatedUsersList = await users.filter((user) => user.id !== userId);
      setUsers(updatedUsersList);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Save or update user data on the server
    try {
      if (selectedUser) {
        const newUser = axios.put(
          `/api/admin/users/${selectedUser._id}`,
          formData
        );
        console.log("newUser: ", newUser.data);
        const updatedUsersList = users.map((user) => {
          if (user._id === selectedUser._id) {
            return newUser.data;
          } else {
            return user;
          }
        });
        setUsers(updatedUsersList);
      } else {
        const newUser = axios.post("/api/admin/users", formData);
        console.log("newUser: ", newUser.data);
        const updatedUsersList = [...users, newUser.data];
        setUsers(updatedUsersList);
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
            Add User
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length ? (
                users.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onChange={handleToggle}
                        icon={<span className="empty-icon">□</span>}
                        checkedIcon={<span className="tick-icon">✓</span>}
                      />
                      <IconButton onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}

      {/* User Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
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
            {selectedUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTab;
