var db = require("../config/connection");
var collection = require("../config/collections");
const e = require("express");
const res = require("express/lib/response");
var objectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const { reject } = require("bcrypt/promises");

module.exports = {

  //user signup
  doSignup: (userInfo) => {
    return new Promise(async (resolve, reject) => {
      let checkUser = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ name: userInfo.name });
      if (!checkUser) {
        userInfo.password = await bcrypt.hash(userInfo.password, 10);
        let AddUser = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userInfo);
        resolve(AddUser);
      } else {
        resolve({
          message: `The username ${userInfo.name} is already exist...`,
        });
      }
    });
  },

  //user login
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let findUser = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ name: userData.name });

      if (findUser) {
        bcrypt.compare(userData.password, findUser.password).then((status) => {
          if (status == true) {
            resolve({ message: "login successfully....." });
          } else {
            console.log("login failed");
            resolve({ message: "password not match..." });
          }
        });
      } else {
        resolve({ message: `The user ${userData.name} is not exist...` });
      }
    });
  },

  //listing all movies
  ListingAllMovies: () => {
    return new Promise(async (resolve, reject) => {
      let getAllMovies = await db
        .get()
        .collection(collection.MOVIE_COLLECTION)
        .find()
        .toArray();
      resolve(getAllMovies);
    });
  },


  //user seat booking and payment through local wallet
  SeatBooking: (datas, count) => {
    console.log(datas);
    return new Promise(async (resolve, reject) => {
      datas.map(async (datas) => {
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: objectId(datas.userId) });
        let seatAvailability = await db
          .get()
          .collection(collection.SEAT_COLLECTION)
          .findOne({ seatId: datas.seatId });
        let show = await db
          .get()
          .collection(collection.MOVIE_COLLECTION)
          .findOne({ movie: datas.movie });

          

        if (!seatAvailability && show && user) {

            let SeatSize = await db.get().collection(collection.SEAT_COLLECTION).count();
            
            if(SeatSize < 100){
                let bookSeat = await db
                .get()
                .collection(collection.SEAT_COLLECTION)
                .insertOne(datas);
              let addPrice = await db
                .get()
                .collection(collection.USER_COLLECTION)
                .updateOne(
                  { _id: objectId(datas.userId) },
                  { $set: { wallet: user.wallet - count * 100 } }
                );
    
              resolve(bookSeat);
            }else{
                resolve({message:"Seat full ....."})
            }
         
        } else {
          resolve({
            message: `SeatId ${datas.seatId}, show ${datas.movie} or user is not available...!`,
          });
        }
      });
    });
  },

  //Get all booked tickets userId basis
  getTicketSlot: (userId) => {
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      let getTickets = await db
        .get()
        .collection(collection.SEAT_COLLECTION)
        .find({ userId: userId })
        .toArray();
      if (getTickets) {
        resolve(getTickets);
      } else {
        resolve({ message: "Please book a ticket...." });
      }
    });
  },

  //cancell ticket seatId basis
  CancelTicket: (seatId) => {
    return new Promise(async (resolve, reject) => {
      let findSeat = await db
        .get()
        .collection(collection.SEAT_COLLECTION)
        .findOne({ seatId: seatId });
      if (findSeat) {
        let deleteSeat = await db
          .get()
          .collection(collection.SEAT_COLLECTION)
          .deleteOne({ seatId: seatId });
        resolve(deleteSeat);
      } else {
        resolve({ message: `SeatId ${seatId} is not booked....!` });
      }
    });
  },


  //User can add wallet amount
  addWalletAmount: (data) => {
    return new Promise(async (resolve, reject) => {
      let findUser = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: objectId(data.userId) });
      if (findUser) {
        let updateAmount = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .updateOne(
            { _id: objectId(data.userId) },
            { $set: { wallet: findUser.wallet + data.amount } }
          );
        resolve(updateAmount);
      } else {
        resolve({ message: `The user not found ...!` });
      }
    });
  },
};
