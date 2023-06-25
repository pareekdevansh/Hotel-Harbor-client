import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import dayjs from "dayjs";

function Bookingscreen() {
  const roomid = useParams().roomid;
  const checkInDate = dayjs(useParams().fromdate);
  const checkOutDate = dayjs(useParams().todate);
  const [user, setuser] = useState(null);
  const [room, setroom] = useState();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(3);

  useEffect(() => {
    async function getroom() {
      try {
        setloading(true);

        // Getting user data
        setuser(JSON.parse(localStorage.getItem("currentUser")));
        console.log(`##@@ ${roomid}`);

        // Getting room details
        const data = (
          await axios.post("/api/rooms/getroombyid/", { id: roomid })
        ).data;
        console.log(`##@@ ${data}`);

        // Calculating number of days
        setNumberOfDays(checkOutDate.diff(checkInDate, "day") + 1);
        setroom(data);
        setloading(false);
        seterror(false);
      } catch (error) {
        seterror(true);
        console.log(`##@@ ${error}`);
        setloading(false);
      }
    }

    getroom();
  }, []);

  return (
    <div className="container">
      <div className="col horizontal-center">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          <div className="row mt-2 box-shadow">
            <div className="col-md-7">
              <h3>{room.name}</h3>
              <img
                style={{
                  height: "500px",
                  width: "100%",
                  borderRadius: "10px",
                }}
                src={room.imageUrl[0]}
                alt="Room"
              />
            </div>
            <div
              style={{ textAlign: "right" }}
              className="col-md-4 m-2 mt-auto"
            >
              <div>
                <p>Booking Details</p>
                <hr />
                <b>
                  <p>Name: {user?.name}</p>
                  <p>From date: {checkInDate.format("DD/MM/YYYY")}</p>
                  <p>To date: {checkOutDate.format("DD/MM/YYYY")}</p>
                  <p>Max Capacity: {room.maxCount}</p>
                </b>
              </div>
              <div>
                <p>Amount</p>
                <hr />

                <b>
                  <p>Total Days: {numberOfDays}</p>
                  <p>Per Day Charge: {room.rentPerDay}</p>
                  <p>Total Rent: {numberOfDays * room.rentPerDay}</p>
                </b>
              </div>
              <div>
                <button className="btn btn-primary">Pay Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookingscreen;
