import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typograph from "@mui/material/Typography";
function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [user, setuser] = useState();
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

  return (
    <Box className="container">
      <Box direction={"column"} className="col horizontal-center">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          rooms.map((room) => {
            return (
              <div className="col m-4">
                <Room room={room} />
              </div>
            );
          })
        )}
      </Box>
    </Box>
  );
}

export default Homescreen;
