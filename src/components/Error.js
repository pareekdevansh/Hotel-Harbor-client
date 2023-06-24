import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
function Error(errorMessage = "Oops! Something went wrong.") {
  return (
    <div style={{ position: "fixed", bottom: 0 }}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </div>
  );
}

export default Error;
