import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Success from "../components/Success";
import Error from "../components/Error";
require("dotenv").config();
const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const duration = 3000;
  const resetToken = useParams().resetToken;
  const navigate = useNavigate();

  const resetPasswordHandler = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    try {
      console.log("token is : ", resetToken);
      const response = await axios.put(
        `${process.env.SERVER_URL}/api/auth/resetpassword/${resetToken}`,
        { password },
        config
      );
      console.log(response);
      setLoading(false);
      setSuccess("Password Reset Successful!");
      setTimeout(() => {
        navigate("/login");
      }, duration);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error || "Something went wrong!");
    }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Stack direction="column" margin={2} sx={{ width: "auto" }} spacing={2}>
        {loading ? (
          <Loader />
        ) : error ? (
          <>
            <Error errorMessage={success} />
            {setTimeout(() => {
              setError("");
            }, duration)}
          </>
        ) : success ? (
          <>
            <Success successMessage={success} />
            {setTimeout(() => {
              setSuccess("");
            }, duration)}
          </>
        ) : null}
      </Stack>
      <Container
        maxWidth="sm"
        sx={{
          border: "1px solid #ccc",
          marginTop: "30px",
          borderRadius: "4px",
          padding: "20px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body1" align="center" mb={2} gutterBottom>
          Enter your new password below.
        </Typography>
        <form>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ maxWidth: "300px", marginBottom: "10px" }}
            />
          </Container>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              sx={{ maxWidth: "300px", marginBottom: "10px" }}
            />
          </Container>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={resetPasswordHandler}
            >
              Reset Password
            </Button>
          </Container>
        </form>
      </Container>
    </Box>
  );
};

export default ResetPasswordScreen;
