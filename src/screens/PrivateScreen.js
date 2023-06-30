import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { Fade } from "@mui/material";
function PrivateScreen() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null );
  const duration = 2000;
  const navigate = useNavigate();
  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        console.log("login related error  ");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }, duration);
  };
  useEffect(() => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showError("Please Login First", true);
    }
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };
      try {
        const { data } = await axios.get("/api/private", config);
        setUserDetails(data.data);
        setTimeout(() => {
          // wait for 2 seconds
        }, duration);
        setLoading(false);
        navigate("/home");
      } catch (error) {
        console.log("getUserPrivateDetails: error is : ", JSON.stringify(error));
        let login =
          error.response.data.error === "No User Found" || "Please Login First";
        showError(error.response.data.error, login);
      }
    };
    fetchPrivateDate();
  }, [navigate]);

  return (
    <div>
      {error ? (
        <Error errorMessage={error} />
      ) : (
        <Fade in={true}>
          <div>
            <Loader />
            <h2>Welcome, {userDetails?.name}!</h2>
            <p>Loading Rooms for you...</p>
          </div>
        </Fade>
      )}
    </div>
  );
}
export default PrivateScreen;
