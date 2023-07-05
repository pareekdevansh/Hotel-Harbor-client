import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import { Box, Button, Stack, Typography } from "@mui/material";

function EmailVerificationScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const verificationToken = useParams().verificationToken;
  useEffect(() => {
     const verifyEmail = async () => {
       try {
         setLoading(true);
         console.log("emailVerificationToken: ", verificationToken);
         const response = await axios.put(
           `${process.env.REACT_APP_SERVER_URL}/api/auth/verifyemail/${verificationToken}`
         );
         setSuccess(true);
         setTimeout(() => {
           setSuccess(false);
           navigate("/login");
         }, 2000);
       } catch (error) {
         console.log("error in verifying email : ", JSON.stringify(error));
         setError(error?.response?.data?.error || "Something went wrong!!");
       }
    };
    setLoading(true);
    setTimeout(() => {
      console.log("going inside verifyEmail() Function now ")
      verifyEmail();
      setLoading(false);
    }, 2000);
  }, []);
 
  return (
    <Stack direction="column" spacing={2} alignItems="center">
      <Typography variant="h4">Email Verification Page</Typography>
      {loading && <Loader />}
      <Box sx={{ position: "fixed", bottom: "10px" }}>
        {success && <Success message="Email verified successfully" />}
        {error && <Error errorMessage={error} />}
      </Box>
    </Stack>
  );
}

export default EmailVerificationScreen;
