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
function Loginscreen() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  const [error, seterror] = useState("false");
  async function loginUser() {
    setloading(true);
    seterror("false");
    const user = {
      email,
      password,
    };
    try {
      const response = await axios.post("/api/users/login", user);
      console.log(response.data);
      setsuccess(true);
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
    } catch (error) {
      seterror("Login Failed.. Please Try again!!");
    }
    setloading(false);
  }
  return (
    <Box display="flex" justifyContent="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        <Typography noWrap variant="h4">
          Login Screen
        </Typography>
        {loading && <Loader />}
        {error != "false" && <Error errorMessage={error} />}
        <Stack direction="column" marginTop={"30px"} spacing={1}>
          <TextField
            id="outlined-basic"
            label="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
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
            onChange={(e) => setpassword(e.target.value)}
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
          <Button onClick={() => (window.location.href = "/register")}>
            Register
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Loginscreen;
