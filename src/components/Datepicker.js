import * as React from "react";
import { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function BasicDatePicker({
  checkInDate,
  checkOutDate,
  onDateSelected,
}) {
  const dateFormat = "DD/MM/YYYY";
  function handleDateChange(date) {
    onDateSelected([date[0], date[1]]);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
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
      </DemoContainer>
    </LocalizationProvider>
  );
}
