import React from "react";
import Button from "@mui/material/Button";

const PaymentButton = ({ handleCheckout }) => {
  return (
    <Button
      sx={{ width: "50%" }}
      paddingBottom="10px"
      variant="contained"
      color="primary"
      onClick={handleCheckout}
    >
      Checkout
    </Button>
  );
};

export default PaymentButton;
