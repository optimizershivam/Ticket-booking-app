const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { connection } = require("./config");
const { seatRouter } = require("./Controller/Seats.route");
// const { seatModel } = require("./Model/Seat.model");     // Uncomment if wnat to add more seats to the database.

const app = express();

app.use(express.json());
app.use(cors());
app.use("/seats", seatRouter);

// Below code create new n-seats data as per the requirement. If want to add more seats to the database uncomment the below code and change the value of i as per the requirement.  

// for (let i=1;i<=80;i++){
//     const seat = new seatModel({seatNumber : i, isBooked : false});
//     seat.save();
// }

app.listen(process.env.PORT, async() => {
    try {
        await connection;
        console.log("App is connected to DB");
        console.log(`Server is running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});

module.exports = { app };