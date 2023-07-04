import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box } from "@mui/material";

function Error({ errorMessage = "Oops! Something went wrong." }) {
  return (
    <Box
      fullWidth
      style={{
        position: "fixed",
        bottom: "20px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
      }}
    >
      <Alert severity="error" align="center" padding="10px">
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
}

export default Error;
