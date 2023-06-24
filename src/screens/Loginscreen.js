import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
function Loginscreen() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  function loginUser() {
    const user = {
      email,
      password,
    };
    console.log(user);
  }
  return (
    <Box display="flex" justifyContent="center">
      <Stack direction="column" margin={2} sx={{ width: "40ch" }} spacing={2}>
        <Typography noWrap variant="h4">
          Login Screen
        </Typography>
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
              onClick={loginUser()}
            >
              Login
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
            New User?
          </Typography>
          <Button>Register</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Loginscreen;
