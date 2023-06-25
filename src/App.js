import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import MenuAppBar from "./components/Appbar";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
