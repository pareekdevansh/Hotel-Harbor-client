import * as React from "react";
import { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack } from "@mui/material";

export default function BasicDatePicker({
  checkInDate,
  checkOutDate,
  onDateSelected,
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const dateFormat = "DD/MM/YYYY";
  function handleDateChange(date) {
    onDateSelected([date[0], date[1]]);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
        <Stack direction={isSmallScreen ? "column" : "row"} spacing={1}>
          <DatePicker
            label="Check-in date"
            value={checkInDate}
            format={dateFormat}
            onChange={(newValue) => {
              handleDateChange([newValue, checkOutDate]);
            }}
          />
          <DatePicker
            label="Check-out date"
            value={checkOutDate}
            format={dateFormat}
            onChange={(newValue) => {
              handleDateChange([checkInDate, newValue]);
            }}
          />
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
}
