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
function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [error, seterror] = useState(false);

  async function registerUser() {
    seterror(false);
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
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      seterror(true);
    }
  }

  return (
    <Box display="flex" justifyContent="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        <Typography noWrap variant="h4">
          Register Screen
        </Typography>
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
          <Button>Login</Button>
        </Stack>
        {error && (
          <div style={{ position: "fixed", bottom: 0 }}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              "Password doesn't match."
            </Alert>
          </div>
        )}
      </Stack>
    </Box>
  );
}

export default Registerscreen;
