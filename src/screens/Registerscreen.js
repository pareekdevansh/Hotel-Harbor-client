import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  const [error, seterror] = useState("false");

  function makeFieldsEmpty() {
    setname("");
    setemail("");
    setpassword("");
    setcpassword("");
  }
  function onNavigateToLoginRoute() {
    window.location.href = "/login";
  }
  async function registerUser() {
    seterror("false");
    setloading(true);
    if (password == cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword,
        isAdmin: false,
      };
      try {
        const response = await axios.post("/api/users/register", user);
        // setloading(false);
        setsuccess(true);
        makeFieldsEmpty();
        console.log(response.data);
      } catch (error) {
        // setloading(false);
        seterror("Registration Failed.. Please Try again!");
      }
    } else {
      seterror("Please Confirm Password Again!!");
    }
    setloading(false);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        {loading && <Loader />}
        <Typography noWrap variant="h4">
          Register Screen
        </Typography>
        {error != "false" && <Error errorMessage={error} />}
        <Stack direction="column" marginTop={"30px"} spacing={1}>
          <TextField
            id="outlined-basic"
            label="Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
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
            label="Password"
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
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            value={cpassword}
            onChange={(e) => setcpassword(e.target.value)}
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

export default Registerscreen;
