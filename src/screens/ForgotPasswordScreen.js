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
      console.log("calling forgot password ");
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/forgotpassword`,
        { email },
        config
      );
      console.log(
        "Result after forgot password: ",
        JSON.stringify(response.data)
      );
      setLoading(false);
      setSuccess("Reset Password Link sent to registered email address");
      setTimeout(() => {
        setError("");
      }, duration);
    } catch (error) {
      setError(error?.response?.data?.error || "Something went wrong!");
      setTimeout(() => {
        setError("");
      }, duration);
    }
  };

  return (
    <Stack
      direction={"column"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {loading && <Loader />}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      <Box bottom={"10px"}>
        {success && (
          <>
            <Success successMessage={success} />
            {setTimeout(() => {
              setSuccess("");
            }, duration)}
          </>
        )}
        {error && (
          <>
            <Error errorMessage={success} />
            {setTimeout(() => {
              setSuccess("");
            }, duration)}
          </>
        )}
      </Box>
    </Stack>
  );
};

export default ForgotPasswordScreen;
