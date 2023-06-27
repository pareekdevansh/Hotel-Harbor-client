import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";

function CheckoutSuccess() {
  const [bookingSuccessful, setBookingSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { roomId, checkInDate, checkOutDate } = useParams();
  const bookingStarted = useRef(false);
  // TODO: handle case :: when user will press back button after navigating to next screen
  useEffect(() => {
    async function bookRoom() {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        console.log(JSON.stringify(user?._id));
        const booking = {
          roomId: roomId,
          userId: user._id,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
        };
        console.log(JSON.stringify(booking));
        const response = (await axios.post("/api/bookings/bookroom", booking))
          .data;
        console.log(response);
        setBookingSuccessful(true);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    }
    if (!bookingStarted.current) {
      bookingStarted.current = true;
      bookRoom();
    }
  }, []);

  useEffect(() => {
    if (error) {
      setLoading(true);
      // TODO showErrorPrompt();
      setTimeout(() => {}, 1000);
      window.location.href = "/notfound";
    }
  }, [error]);

  useEffect(() => {
    if (bookingSuccessful) {
      setLoading(true);
      // TODO: showSuccessPrompt();
      setTimeout(() => {}, 1000);
      window.location.href = "/bookings";
    }
  }, [bookingSuccessful]);
  async function bookRoom() {
    try {
      const user = await JSON.parse(localStorage.getItem("currentUser"));
      console.log(JSON.stringify(user?._id));
      const booking = {
        roomId: roomId,
        userId: user._id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
      };
      console.log(JSON.stringify(booking));
      const response = await axios.post("/api/bookings/bookroom", booking);
      console.log(response);
    } catch (error) {
      throw error;
    }
  }
  return (
    <div>
      {loading && <Loader />}
      <h1>Payment Successful... Booking Your Room </h1>
    </div>
  );
}
export default CheckoutSuccess;
