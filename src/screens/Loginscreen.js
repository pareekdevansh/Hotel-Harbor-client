import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { duration } from "@mui/material";
function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();
  const errorDuration = 3000;
  const successDuration = 1000;

  const navigateToRegisterScreen = () => {
    navigate("/register ");
  };
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);
  async function loginUser() {
    setLoading(true);
    setError("");
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    const user = {
      email,
      password,
    };
    try {
      const { data } = await axios.post("/api/auth/login", user, config);
      console.log("a fresh token received: ", data.token);
      localStorage.setItem("authToken", data.token);
      console.log(
        "local Storage taken value : ",
        localStorage.getItem("authToken")
      );
      setSuccess("Login Successful!");
      setTimeout(() => {}, successDuration);
      setSuccess("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setTimeout(() => {
        setError(error.response.data.error || "Something went wrong!");
      }, errorDuration);
      setError("");
    }
  }
  return (
    <Box display="flex" justifyContent="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        <Typography noWrap variant="h4">
          Login Screen
        </Typography>
        {loading && <Loader />}
        {error && <Error errorMessage={error} />}
        {success && <Success message={error} />}

        <Stack direction="column" marginTop={"30px"} spacing={1}>
          <TextField
            id="outlined-basic"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            label="Password"
            variant="outlined"
          />
          <Stack direction="row" justifyContent="center">
            <Button
              variant="outlined"
              sx={{ width: "20ch" }}
              onClick={loginUser}
            >
              Login
            </Button>
          </Stack>
          {success && <Success message="Login Successful" />}
        </Stack>
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="flex-end"
          marginTop={1}
          spacing={1}
        >
          <Typography variant="button" style={{ marginRight: "2px" }}>
            New User?
          </Typography>
          <Button onClick={navigateToRegisterScreen}>Register</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default LoginScreen;
