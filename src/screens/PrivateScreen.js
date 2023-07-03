import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { Fade } from "@mui/material";
function PrivateScreen({ handleAppBarRefresh }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const duration = 2000;
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  const showError = (message, login) => {
    setLoading(false);
    setError(message);
    setTimeout(() => {
      setError("");
      if (login) {
        console.log("login related error  ");
        logOut();
      }
    }, duration);
  };

  useEffect(() => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showError("Please Login First", true);
      return;
    } else {
      const fetchPrivateDate = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        };
        try {
          const response = await axios.get("/api/private", config);
          console.log("response is ", response.data);
          localStorage.setItem("currentUser", JSON.stringify(response.data));
          const value = JSON.parse(localStorage.getItem("currentUser"));
          console.log("##@@value1 is: ", value);
          console.log(
            "##@@2value is: ",
            JSON.parse(localStorage.getItem("currentUser"))
          );
          console.log("##@@calling refresh state");
          handleAppBarRefresh();
          setTimeout(() => {}, 500);
          console.log("##@@after timeout ");
          setLoading(false);
          navigate("/home");
        } catch (error) {
          console.log(
            "getUserPrivateDetails: error is : ",
            JSON.stringify(error)
          );
          let login = error.message === "No User Found" || "Please Login First";
          showError(error.message, login);
        }
      };
      fetchPrivateDate();
    }
    setLoading(false);
  }, []);

  return (
    <div>
      {/* {error ? (
        <Error errorMessage={error} />
      ) : (
        <Fade in={true}>
          <div>
            <Loader />
            <h2>Welcome !!!</h2>
            <p>Loading Rooms for you...</p>
          </div>
        </Fade>
      )} */}
    </div>
  );
}
export default PrivateScreen;
