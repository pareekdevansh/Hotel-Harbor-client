import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import BasicDatePicker from "../components/Datepicker";
import dayjs from "dayjs";
function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [user, setuser] = useState();
  const today = dayjs();
  const threedaylater = today.add(3, "day");
  const dateFormat = "DD/MM/YYYY";
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(threedaylater);
  useEffect(() => {
    async function getallrooms() {
      try {
        setloading(true);
        setuser(JSON.parse(localStorage.getItem("currentUser")));
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data);
        seterror(false);
        setloading(false);
        console.log(rooms);
      } catch (error) {
        seterror(true);
        setloading(false);
        console.log(error);
      }
    }
    getallrooms();
  }, []);
  const handleDateChange = (date) => {
    setCheckInDate(date[0]);
    setCheckOutDate(date[1]);
    console.log(date);
  };
  return (
    <Box className="container">
      <Box
        direction={"column"}
        margin={"10px"}
        className="col horizontal-center"
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          <Box>
            <Stack direction={"row"} spacing={2}>
              <BasicDatePicker checkInDate={checkInDate} checkOutDate={checkOutDate} onDateSelected={handleDateChange} />
            </Stack>
            {rooms.map((room) => (
              <div className="col m-4">
                <Room
                  room={room}
                  fromdate={checkInDate}
                  todate={checkOutDate}
                />
              </div>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Homescreen;
