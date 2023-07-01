import React, { useCallback, useEffect, useState } from "react";
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
  Slider,
  Switch,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios, { isCancel } from "axios";
import Loader from "../Loader";
import Error from "../Error";
import { styled } from "@mui/system";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import dayjs from "dayjs";

const UsersTab = () => {
  const TableContainer = styled("div")({
    overflowX: "auto",
  });
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const errorDuration = 3000;

  // dialog State
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  //to refresh user's list
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  // track of admin state
  const [isAdminSelected, setIsAdminSelected] = useState(false);

  const handleAdminSwitch = () => {
    const state = !formData.isAdmin;
    setFormData((prevFormData) => ({
      ...prevFormData,
      isAdmin: state,
    }));
    console.log("formdata : ", formData);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("calling user endpoint");
      const response = (await axios.get("/api/admin/users")).data;

      setUsers(response);
      console.log("Response[] : ", response);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      console.log("not cancelled");
      fetchData();
    } else {
      console.log("cancelled");
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleOpenDialog = (user) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        isAdmin: false,
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
      fetchData();
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };
  const isFormDataEmpty = () => {
    // if admin is false=> by default client user will be created
    return !formData.name || !formData.email;
  };
  const handleSave = async () => {
    console.log("data forms: ", formData);
    if (isFormDataEmpty() && (selectedUser || !formData.password)) {
      setError("Pleas Fill User Data First!!");
      return;
    }
    setLoading(true);
    // Save or update user data on the server
    try {
      if (selectedUser) {
        const userData = {
          name: formData.name,
          email: formData.email,
          isAdmin: formData.isAdmin,
        };
        const newUser = await axios.put(
          `/api/admin/users/${selectedUser._id}`,
          userData
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
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin,
        };
        const newUser = await axios.post("/api/admin/users", userData);
        console.log("newUser: ", newUser.data);
        const updatedUsersList = [...users, newUser.data];
        setUsers(updatedUsersList);
      }
      fetchData();
    } catch (error) {
      console.log(error.response.data.error);
      setLoading(false);
      setError(error.message);
    }
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
            Add User
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
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
                      {dayjs(user.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>
                      {dayjs(user.updatedAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="status"
                        onClick={handleAdminSwitch}
                      >
                        <AdminPanelSettingsIcon
                          sx={{ color: user.isAdmin ? "blue" : "grey" }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user._id)}>
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
          <TableContainer></TableContainer>
        </>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{(selectedUser ? "Edit" : "Add") + " User"}</DialogTitle>
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
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleFormChange}
          />
          {!selectedUser && (
            <TextField
              margin="dense"
              name="password"
              label="Password"
              fullWidth
              value={formData.password}
              onChange={handleFormChange}
            />
          )}
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAdmin}
                  onChange={handleAdminSwitch}
                  color="primary"
                />
              }
              label="Admin Access"
            />
          </FormControl>
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
