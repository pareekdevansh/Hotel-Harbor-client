import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
function PrivateScreen() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [privateDate, setPrivateData] = useState();
  const errorDuration = 2000;
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    console.log("Private Screen : token from local Storage: ", authToken);
    if (!authToken) {
      setLoading(false);
      setTimeout(() => {
        console.log(`line 20 problem`);
        setError("You are not logged in!");
      }, errorDuration);
      setError("");
      navigate("/login");
    }
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };
      try {
        console.log("before call to API.Private");
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
        console.log(
          "Private Screen : received private data: ",
          JSON.stringify(data)
        );
        setLoading(false);
        // navigate to home screen now
        navigate("/home");
      } catch (error) {
        console.log(
          "PrivateScreen : removing the token from local Storage due to: ",
          error
        );
        localStorage.removeItem("authToken");
        setLoading(false);
        setTimeout(() => {
          setError(error.response.data.error);
        }, errorDuration);
        setError("");
        navigate("/login");
      }
    };
    fetchPrivateDate();
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error errorMessage={error} />
      ) : (
        <p>{privateDate}</p>
      )}
    </div>
  );
}
export default PrivateScreen;
