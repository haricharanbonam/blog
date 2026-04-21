import connectDB from "./db/Connection.js";
import dotenv from "dotenv";
import express from "express";
import { app } from "./app.js";
import dns from 'node:dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
  app.listen(process.env.PORT || 8000, () => {
      console.log("server is runnxmcncning");
    });
  })
  .catch(() => {
    console.log("mongodb connection error");
  });
