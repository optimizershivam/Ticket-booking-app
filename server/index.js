const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { connection } = require("./config");
const { seatRouter } = require("./Controller/Seats.route");


const app = express();

app.use(express.json());
app.use(cors());
app.use("/seats", seatRouter);


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