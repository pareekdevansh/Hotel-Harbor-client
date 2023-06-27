import React from "react";
import Button from "@mui/material/Button";

const PaymentButton = ({ handleCheckout }) => {
  return (
    <Button variant="contained" color="primary" onClick={handleCheckout}>
      Checkout
    </Button>
  );
};

export default PaymentButton;
