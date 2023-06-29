import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuAppBar from "./components/AppBar";
import CheckoutSuccess from "./components/PaymentSuccess";
import NotFound from "./components/NotFound";
import MyBookingsScreen from "./screens/MyBookingsScreen";
import UserProfile from "./screens/ProfileScreen";
import BookingScreen from "./screens/BookingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import PrivateScreen from "./screens/PrivateScreen";
import PrivateRoute from "./routing/PrivateRoute";

function App() {
  return (
    <div className="App">
      <MenuAppBar />
      <BrowserRouter>
        <Routes>
          {/* <PrivateRoute path="/" element={<PrivateScreen />} /> */}
          <Route path="/" element={<PrivateScreen />} />
          <Route path="/register" Component={RegisterScreen} />
          <Route path="/login" Component={LoginScreen} />
          <Route path="/forgotpassword" Component={ForgotPasswordScreen} />
          <Route
            path="/resetpassword/:resetToken"
            Component={ResetPasswordScreen}
          />
          <Route path="/home" Component={HomeScreen} />
          <Route
            path="/book/:roomId/:fromDate/:toDate"
            Component={BookingScreen}
          />
          <Route
            path="/checkout-success/:roomId/:checkInDate/:checkOutDate"
            Component={CheckoutSuccess}
          />
          <Route path="/bookings" Component={MyBookingsScreen} />
          <Route path="/notfound" Component={NotFound} />
          <Route path="/profile" Component={UserProfile} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
