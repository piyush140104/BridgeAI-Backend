import dotenv from "dotenv";
import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";

import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Connection Failed ", err);
  });

/*
(async()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on('error' , (error)=>{
            console.log("ERROR" , error)
            throw error
        })

        app.listen(process.env.PORT , ()=>{
            console.log(`App running on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("Error" , error)
        throw err
        
    }
})
*/
