import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import dayjs from "dayjs";
import Success from "../components/Success";
import PaymentButton from "../components/PayButton";

function BookingScreen() {
  const navigate = useNavigate();
  const roomId = useParams().roomId;
  const checkInDate = dayjs(useParams().fromDate);
  const checkOutDate = dayjs(useParams().toDate);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [totalAmount, setTotalAmount] = useState(null);
  const duration = 3000;

  useEffect(() => {
    getRoom();
  }, []);

  useEffect(() => {
    if (room) {
      setNumberOfDays(checkOutDate.diff(checkInDate, "days") + 1);
      setTotalAmount(room.rentPerDay * numberOfDays);
    }
  }, [room, checkInDate, checkOutDate]);

  // show error for $duration
  // clear authToken & navigate to login if it's a login error
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
  async function getRoom() {
    setLoading(true);
    setError("");
    try {
      // Getting room details
      const data = (await axios.post("/api/rooms/getroombyid/", { id: roomId }))
        .data;
      setRoom(data);
      setLoading(false);
    } catch (error) {
      showError("something went wrong!!", false);
    }
  }

  async function handleCheckoutEvent() {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showError("Please Login First", true);
    }
    const booking = {
      roomId: room?._id,
      roomName: room?.name,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      totalAmount: totalAmount,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    console.log(JSON.stringify(config));
    console.log(JSON.stringify(booking));
    try {
      const response = await axios.post(
        "/api/stripe/create-checkout-session/",
        booking,
        config
      );
      console.log("session created!!");
      console.log(response);
      if (response.data.url) {
        setLoading(false);
        // navigate(response.data.url);
        window.location.href = response.data.url;
      }
    } catch (error) {
      let login =
        error.response.data.error === "Please Login First" ||
        error.response.data.error === "No User Found";
      showError(error.response.data.error, login);
    }
  }

  return (
    <div className="container">
      <div className="col horizontal-center">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error errorMessage={error} />
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
                <b>Booking Details</b>
                <hr />
                {/* <p>Name: {user?.name}</p> */}
                <p>From date: {checkInDate.format("DD/MM/YYYY")}</p>
                <p>To date: {checkOutDate.format("DD/MM/YYYY")}</p>
                <p>Max Capacity: {room?.maxCount}</p>
              </div>
              <div>
                <b>Amount</b>
                <hr />
                <p>Total Days: {numberOfDays}</p>
                <p>Per Day Charge: {room?.rentPerDay}</p>
                <p>Total Rent: {totalAmount}</p>
              </div>
              <div>
                <PaymentButton handleCheckout={handleCheckoutEvent} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0 }}>
        {success && <Success message={"Booking Successful!"} />}
      </div>
    </div>
  );
}

export default BookingScreen;
