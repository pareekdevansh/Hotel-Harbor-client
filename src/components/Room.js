import React from "react";
import { useState } from "react";
import { Modal, Carousel, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, CardContent } from "@mui/material";

function Room({ room, fromDate, toDate }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const navigateToBookingScreen = () => {
    console.log(fromDate, " ", toDate);
    navigate(`/book/${room._id}/${fromDate}/${toDate}`);
  };
  return (
    <div>
      <Card sx={{ minWidth: 400 }}>
        <CardContent>
          <div className="row ">
            <img
              className="small-img"
              src="https://hips.hearstapps.com/hmg-prod/images/living-room-ideas-caroline-turner-orchardlane01-copy-1670968014.jpeg?crop=1.00xw:0.751xh;0,0.171xh&resize=1200:*"
              alt="Room"
            />
            <div className="col" style={{ float: "right", textAlign: "left" }}>
              <h1>{room.name}</h1>
              <p>Type: {room.roomType} </p>
              <p>Max Count: {room.maxCount} </p>
              <p>Phone Number: {room.phoneNumber} </p>
              <p>Email: {room.email} </p>
              <p>Rent Per Day: {room.rentPerDay} INR</p>

              <div style={{ float: "right" }}>
                {/* <Link to={`/book/${room._id}/${fromdate}/${todate}`}> */}
                <Button
                  variant="contained"
                  className="ml-auto"
                  style={{ marginRight: "10px" }}
                  onClick={navigateToBookingScreen}
                >
                  Book
                </Button>
                {/* </Link> */}
                <Button
                  variant="contained"
                  className="ml-auto"
                  onClick={handleShow}
                >
                  View details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel fade prevLabel="" nextLabel="">
            {room.imageUrl.map((url) => {
              return (
                <Carousel.Item key={url}>
                  <img className="d-block w-100" src={url} alt="room" />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ marginRight: "10px" }}
          >
            Close
          </Button>
          {/* <Link to={`/book/${room._id}/${fromdate}/${todate}`}> */}
          <Button variant="contained" onClick={navigateToBookingScreen}>
            Book
          </Button>
          {/* </Link> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
