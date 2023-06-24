import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

function Success({ message }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        {message}
      </Alert>
    </div>
  );
}

export default Success;
