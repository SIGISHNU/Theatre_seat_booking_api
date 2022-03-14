var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin_helpers')

//admin login details

let adminDetails = {
  adminName:"sigi",
  password:"123"
}

/* GET home page. */

//admin login router

router.post('/admin_login',(req,res)=>{
  if(adminDetails.adminName === req.body.name && adminDetails.password === req.body.password){
    res.status(200).json({message:"admin loggin successfully..."})
  }else{
    res.status(500).json({message:"admin name or password not match ...!"})
  }
})


//admin can add movies

router.post('/add_movie', function(req, res, next) {
  adminHelpers.AddShows(req.body).then((response)=>{
    return res.status(200).json({response});
  })
});


//admin can get all movies

router.get('/all_movies/:page/:size',(req,res)=>{
  var listInfo = req.params
  console.log(listInfo);
  adminHelpers.getAllMovies(listInfo).then((Movies)=>{
    res.status(200).json({listInfo,Movies})
  })
})


//admin can delete added movies

router.post('/delete_movie/:movie',((req,res)=>{
  adminHelpers.deleteShow(req.params.movie).then((response)=>{
    res.status(200).json(response)
  })
}))

module.exports = router;
