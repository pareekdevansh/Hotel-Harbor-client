import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminScreen from "./screens/AdminScreen";
import MenuAppBar from "./components/AppBar";

function App() {
  const [refreshAppBar, setRefreshAppBar] = useState(false);

  const handleAppBarRefresh = () => {
    const oldValue = refreshAppBar;
    setRefreshAppBar(!oldValue);
  };
  return (
    <div className="App">
      <BrowserRouter>
        {refreshAppBar && <MenuAppBar refreshAppBar={refreshAppBar} />}
        {!refreshAppBar && <MenuAppBar refreshAppBar={refreshAppBar} />}
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={
              <PrivateScreen handleAppBarRefresh={handleAppBarRefresh} />
            }
          />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route
            path="/resetpassword/:resetToken"
            element={<ResetPasswordScreen />}
          />
          <Route path="/home" element={<HomeScreen />} />
          <Route
            path="/book/:roomId/:fromDate/:toDate"
            element={<BookingScreen />}
          />
          <Route
            path="/checkout-success/:roomId/:checkInDate/:checkOutDate/:bookingId"
            element={<CheckoutSuccess />}
          />
          <Route
            path="/admin"
            element={<AdminScreen handleAppBarRefresh={handleAppBarRefresh} />}
          />
          <Route
            path="/bookings"
            element={
              <MyBookingsScreen handleAppBarRefresh={handleAppBarRefresh} />
            }
          />
          <Route
            path="/profile"
            element={<UserProfile handleAppBarRefresh={handleAppBarRefresh} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
