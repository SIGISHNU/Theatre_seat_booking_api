var db = require('../config/connection');
var collection =require('../config/collections');
const { reject } = require('bcrypt/promises');
var objectId = require('mongodb').ObjectId;


module.exports = {

    //Admin can add movies
    AddShows:(datas)=>{

        return new Promise (async(resolve,reject)=>{
            let findMovie = await db.get().collection(collection.MOVIE_COLLECTION).findOne({movie:datas.movie})
            if(!findMovie){
                let addMovie = await db.get().collection(collection.MOVIE_COLLECTION).insertOne(datas)
                resolve(addMovie)
            }else{
                resolve({message:`The Movie ${datas.movie} is alredy exist...!`})
            }
        })

    },

    //Admin can get all movies list and also added pagination
    getAllMovies:(listInfo)=>{

        return new Promise (async(resolve,reject)=>{
            if(!listInfo.page){
                listInfo.page = 1;
            }

            if(!listInfo.size){
                listInfo.size = 5;
            }

            const limit = parseInt(listInfo.size);
            const skip = (listInfo.page - 1) * listInfo.size;

            let getAllmoviesList = await db.get().collection(collection.MOVIE_COLLECTION).find().limit(limit).skip(skip).toArray()
            resolve(getAllmoviesList)
        })
    },


    //Admin can delete movies
    deleteShow:(movie)=>{
        return new Promise(async(resolve,reject)=>{
            let findShow = await db.get().collection(collection.MOVIE_COLLECTION).findOne({movie:movie})
            if(findShow){
                let deleteMovie = await db.get().collection(collection.MOVIE_COLLECTION).deleteOne({movie:movie})
                let findMovieSeat = await db.get().collection(collection.SEAT_COLLECTION).find({movie:movie})
                if(findMovieSeat){
                    let deleteMovieSeat = await db.get().collection(collection.SEAT_COLLECTION).deleteMany({movie:movie})
                }
                resolve(deleteMovie)
            }else{
                resolve({message:`The movie ${movie} not exists...!`})
            }
        })
    }
}