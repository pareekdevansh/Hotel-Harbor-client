import React from 'react'
import { useState } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Room({ room }) {
  const [show, setShow] = useState(false);
  console.log(`room id is ${room._id}`);
  console.log("room id is " + room._id);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <div className='row box-shadow justify-content-center'>
      <div className='col'>
        <img className='small-img' src="https://hips.hearstapps.com/hmg-prod/images/living-room-ideas-caroline-turner-orchardlane01-copy-1670968014.jpeg?crop=1.00xw:0.751xh;0,0.171xh&resize=1200:*" alt="Room" />
      </div>
      <div className='col' style={{ textAlign: 'left' }}>
        <h1>{room.name}</h1>
        <p>Type: {room.roomType} </p>
        <p>Max Count: {room.maxCount} </p>
        <p>Phone Number: {room.phoneNumber} </p>
        <p>Email: {room.email} </p>
        <p>Rent Per Day: {room.rentPerDay} INR</p>

        <div style={{ float: 'right' }}>

          <Link to={`/book/${room._id}`} >
            <button className='btn btn-primary ml-auto' style={{ marginRight: '10px' }}>Book</button>
          </Link>
          <button className='btn btn-primary ml-auto' onClick={handleShow}>View details</button>
        </div>

      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel fade prevLabel='' nextLabel=''>
            {
              room.imageUrl.map(url => {
                return <Carousel.Item>
                  <img
                    className="d-block w-100 big-img"
                    src={url}
                    alt='room'
                  />
                </Carousel.Item>

              }
              )
            }

          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Book
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  )
}

export default Room;
