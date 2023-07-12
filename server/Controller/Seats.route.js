const express = require("express");
const seatRouter = express.Router();

const { seatModel } = require("../Model/Seat.model");
const { checkCount } = require("../Middleware/Count");

// GET route 


seatRouter.get("/", async(req, res) => {
    const seats = await seatModel.find().sort({"seatNumber" : 1});      
    res.status(200).send(seats);                                        
});


// Make a patch request at "/seats/book" to reserve/book the seat.

seatRouter.patch("/book", checkCount, async (req, res) => {
  const requiredSeats = req.body.seats;
  console.log({requiredSeats})
  const seats = await seatModel.find().sort({ seatNumber: 1 });

  let reserved = [];

  let i = 0;
  while (i < seats.length) {
    let empty = 0;
    let startIndex = -1;
    for (let j = i; j < i + 7 && j < seats.length; j++) {
      if (seats[j].isBooked === false) {
        empty++;
        if (startIndex === -1) {
          startIndex = j;
        }
      }
    }

    if (empty >= requiredSeats) {
      for (let j = startIndex; j < startIndex + requiredSeats; j++) {
        reserved.push(seats[j].seatNumber);
        await seatModel.findByIdAndUpdate({ _id: seats[j]._id }, { isBooked: true });
      }
      break;
    } else {
      i += 7;
    }
  }

  if (reserved.length === requiredSeats) {
    res.status(200).send(reserved); // Response to the request with seat numbers which have been booked.
  } else {
    const isEmpty = await seatModel.find({ isBooked: false }).sort({ seatNumber: 1 });

    if (isEmpty.length < requiredSeats) {
      res.status(400).send({ message: "Sorry, we don't have enough seats to book." }); // Error response due to unavailability of the required seats.
    } else {
      let difference = [];
      for (let a = 0; a <= isEmpty.length - requiredSeats; a++) {
        let first = isEmpty[a].seatNumber;
        let last = isEmpty[a + requiredSeats - 1].seatNumber;
        difference.push(last - first);
      }

      let least = Math.min(...difference);
      let index = difference.indexOf(least);

      for (let j = index; j < index + requiredSeats; j++) {
        reserved.push(isEmpty[j].seatNumber);
        await seatModel.findByIdAndUpdate({ _id: isEmpty[j]._id }, { isBooked: true });
      }

      res.status(200).send(reserved); // Response to the request with seat numbers which have been booked.
    }
  }
});



// Make a patch request at "/seats/reset" to reset all the seats status to available.

seatRouter.patch("/reset", async(req, res) => {
    try {
        await seatModel.updateMany({isBooked : true}, {isBooked : false});                  
        res.status(200).send({ "message" : "All seats are available for booking." });   
    } catch (error) {
        console.log(error);
        res.status(400).send(error);        
    }
})

module.exports = { seatRouter };