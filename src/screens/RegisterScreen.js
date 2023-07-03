import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Success from "../components/Success";
import Error from "../components/Error";
function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const duration = 3000;
  function makeFieldsEmpty() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  function onNavigateToLoginRoute() {
    navigate("/login");
  }
  // if already logged in, go to home screen
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  async function registerUser() {
    setLoading(true);
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    if (password === confirmPassword) {
      const user = {
        name,
        email,
        password,
      };
      try {
        console.log("before call with user: ", user);
        const { data } = await axios.post("/api/auth/register", user, config);
        console.log(`response: ${JSON.stringify(data)}`);
        setTimeout(() => {
          setSuccess(data);
        }, duration);
        setLoading(false);
        makeFieldsEmpty();
        navigate("/login");
      } catch (error) {
        setLoading(false);
        setTimeout(() => {
          setError(error);
        }, duration);
        setError("");
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        setError("Please Confirm Password Again!!");
      }, duration);
      setError("");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        {loading && <Loader />}
        <Typography noWrap variant="h4">
          Register Screen
        </Typography>
        {error && <Error errorMessage={error} />}
        {success && <Success message={"User Registration Successful!"} />}
        <Stack direction="column" marginTop={"30px"} spacing={1}>
          <TextField
            id="outlined-basic"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
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
            label="Password"
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
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <Stack direction="row" justifyContent="center">
            <Button
              variant="outlined"
              sx={{ width: "20ch" }}
              onClick={registerUser}
            >
              Register
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="flex-end"
          marginTop={1}
          spacing={1}
        >
          <Typography variant="button" style={{ marginRight: "2px" }}>
            Already Registered?
          </Typography>
          <Button onClick={onNavigateToLoginRoute}>Login</Button>
        </Stack>
        {success && <Success message={"Registered Successfully"} />}
      </Stack>
    </Box>
  );
}

export default RegisterScreen;
