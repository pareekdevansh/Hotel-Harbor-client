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
  const [user, setuser] = useState(null);

  //  all rooms data
  const [rooms, setrooms] = useState([]);
  //  available rooms after filtering according to date selected
  const [availableRooms, setAvailableRooms] = useState([]);

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);

  // !! by default dates selected will be (today , today + 3 days)
  const dateFormat = "DD/MM/YYYY";
  const today = dayjs();
  const threedaylater = today.add(3, "day");
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(threedaylater);

  async function getallrooms() {
    setloading(true);
    try {
      setuser(JSON.parse(localStorage.getItem("currentUser")));
      const data = (await axios.get("/api/rooms/getallrooms")).data;
      console.log(data);
      setrooms(data);
      seterror(false);
      setloading(false);
    } catch (error) {
      seterror(true);
      setloading(false);
      console.log(error);
    }
  }
  function getAvailableRooms() {
    const filteredRooms = rooms.filter((room) => {
      for (const booking of room.currentBookings) {
        const isBefore = checkOutDate.isBefore(booking.checkInDate, "day");
        const isAfter = checkInDate.isAfter(booking.checkOutDate, "day");

        if (!isBefore && !isAfter) {
          console.log(`before ${isBefore}`);
          console.log(`after ${isAfter}`);
          console.log(`${room.name} Room is unavailable`);
          return false; // Room is unavailable
        }
      }
      console.log(`${room.name} Room is available`);
      return true; // Room is available
    });

    console.log(`Filtered rooms list: ${filteredRooms.length}`);
    return filteredRooms;
  }

  useEffect(() => {
    getallrooms();
  }, []);

  useEffect(() => {
    if (
      checkInDate.isBefore(checkOutDate, "day") ||
      checkInDate.isSame(checkOutDate, "day")
    ) {
      setAvailableRooms(getAvailableRooms());
    } else {
      setAvailableRooms([]);
    }
  }, [checkInDate, checkOutDate, rooms]);

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
              <BasicDatePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateSelected={handleDateChange}
              />
            </Stack>
            {availableRooms.map((room) => (
              <div key={room._id} className="col m-4">
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
