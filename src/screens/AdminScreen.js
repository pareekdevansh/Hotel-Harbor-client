import React, { useState, useEffect }  from "react";
import { Tabs, Tab } from "@mui/material";
import BookingsTab from "../components/admin/BookingsTab";
import UsersTab from "../components/admin/UsersTab";
import RoomsTab from "../components/admin/RoomsTab";

const AdminScreen = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Booking" />
        <Tab label="User" />
        <Tab label="Room" />
      </Tabs>
      {activeTab === 0 && <BookingsTab />}
      {activeTab === 1 && <UsersTab />}
      {activeTab === 2 && <RoomsTab />}
    </div>
  );
};

export default AdminScreen;
