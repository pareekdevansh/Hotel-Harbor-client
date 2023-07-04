import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Success from "./Success";
function CheckoutSuccess() {
  const navigate = useNavigate();
  const [bookingSuccessful, setBookingSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { roomId, checkInDate, checkOutDate, bookingId } = useParams();
  // even in development mode , useEffect will be called once
  const bookingStarted = useRef(false);
  const duration = 3000;
  // TODO: handle case :: when user will press back button after navigating to next screen

  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }, duration);
  };

  useEffect(() => {
    async function bookRoom() {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          showError("Please Login First", true);
        }
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        console.log("bookingId is ", JSON.stringify(bookingId));
        const response = (
          await axios.put(
            `${process.env.REACT_APP_SERVER_URL}/api/bookings/bookroom`,
            { bookingId },
            config
          )
        ).data;
        console.log(response);
        setBookingSuccessful(true);
      } catch (error) {
        // let login =
        //   error.response.data.error === "No User Found" || "Please Login First";
        showError(error.response.data.error, false);
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
      setLoading(false);
      setTimeout(() => {}, duration);
      setBookingSuccessful(false);
      navigate("/bookings");
    }
  }, [bookingSuccessful]);

  return (
    <div>
      {loading && <Loader />}
      {error && <Error errorMessage={error} />}
      {bookingSuccessful && <Success message={"Booking Successful!"} />}
      <h1>Payment Successful... Booking Your Room </h1>
    </div>
  );
}
export default CheckoutSuccess;
