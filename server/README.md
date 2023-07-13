

Add this to index.js if more seats required in DB.

// const { seatModel } = require("./Model/Seat.model");     // Uncomment if wnat to add more seats to the database.

// Below code create new n-seats data as per the requirement. If want to add more seats to the database uncomment the below code and change the value of i as per the requirement.  

// for (let i=1;i<=80;i++){
//     const seat = new seatModel({seatNumber : i, isBooked : false});
//     seat.save();
// }