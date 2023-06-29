import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Container,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const duration = 3000;

  const forgotPasswordHandler = async () => {
    setLoading(true);
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        "/api/auth/forgotpassword",
        { email },
        config
      );
      console.log(response);
      setSuccess("Reset Password Link sent to registered email address");
    } catch (error) {
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
              setSuccess("");
            }, duration)}
          </>
        ) : success ? (
          <>
            <Success successMessage={success} />
            {setTimeout(() => {
              setSuccess("");
            }, duration)}
          </>
        ) : (
          <></>
        )}
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
          Forgot Password
        </Typography>
        <Typography variant="body1" align="center" mb={2} gutterBottom>
          Enter email to reset your password.
        </Typography>
        <form>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              sx={{ maxWidth: "300px", marginBottom: "10px" }}
            />
          </Container>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={forgotPasswordHandler}
            >
              Request Reset Link
            </Button>
          </Container>
        </form>
      </Container>
    </Box>
  );
};

export default ForgotPasswordScreen;
