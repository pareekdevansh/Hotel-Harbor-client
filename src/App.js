import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import MenuAppBar from "./components/Appbar";
import CheckoutSuccess from "./components/PaymentSuccess";
import NotFound from "./components/NotFound";
import Error from "./components/Error";
import MyBookingsScreen from "./screens/MyBookingsScreen";

function App() {
  return (
    <div className="App">
      <MenuAppBar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" Component={Homescreen} />
          <Route
            path="/book/:roomid/:fromdate/:todate"
            Component={Bookingscreen}
          />
          <Route path="/register" Component={Registerscreen} />
          <Route path="/login" Component={Loginscreen} />
          <Route
            path="/checkout-success/:roomId/:checkInDate/:checkOutDate"
            Component={CheckoutSuccess}
          />
          <Route path="/bookings" Component={MyBookingsScreen} />
          <Route path="/notfound" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
