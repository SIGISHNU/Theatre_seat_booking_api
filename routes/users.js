var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user_helpers");


/* GET users listing. */

//user signup router

router.post("/signup", function (req, res, next) {
  var userInfo = req.body;
  userHelpers.doSignup(userInfo).then((response) => {
    res.status(200).json(response);
  });
});


//user login router

router.post("/login", (req, res) => {
  var userData = req.body;
  userHelpers.doLogin(userData).then((response) => {
    res.status(200).json(response);
  });
});

//user can view all movies

router.get("/all_shows", (req, res) => {
  userHelpers.ListingAllMovies().then((movies) => {
    res.status(200).json(movies);
  });
});

//user can book tickets

router.get("/seat_book", function (req, res, next) {
  var seatInfo = req.body;
  const count = seatInfo.filter((item) => item).length;
  console.log("count:", count);
  userHelpers.SeatBooking(seatInfo, count).then((response) => {
    res.status(200).json(response);
  });
});


//user can view booked tickets

router.get('/booked_seat/:id',(req,res)=>{
  var userId = req.params.id
  userHelpers.getTicketSlot(userId).then((response)=>{
    res.status(200).json(response)
  })
})


//user can cancel ticket

router.post("/cancel_ticket/:id",((req,res)=>{
  var seatId = req.params.id
  userHelpers.CancelTicket(seatId).then((response)=>{
   res.status(200).json(response)
  })
}))

//user can add amount to the user wallet

router.post('/add_amount',(req,res)=>{
  var datas = req.body
  userHelpers.addWalletAmount(datas).then((response)=>{
    res.status(200).json(response)
  })
})

module.exports = router;
