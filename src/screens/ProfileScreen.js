import React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const user = {
  name: "John Doe",
  email: "johndoe@example.com",
  phoneNumber: "123-456-7890",
};

function UserProfile() {
  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 400, margin: "0 auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Name: {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Phone Number: {user.phoneNumber}
        </Typography>
        <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserProfile;
