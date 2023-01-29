import express from "express";
import http from "http";
import todoRouter from "./routes/todos.mjs";
import GetClassIdRouter from "./routes/getClassId.mjs";
import FileUpload from "./routes/fileUpload.mjs";
import cors from "cors";
import { Server } from "socket.io";
import morgan from "morgan";

import mongoose from "mongoose";

import * as dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
let PORT = process.env.PORT || 8000;
// to create http server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const url = process.env.MONGODB_URL;

await mongoose.connect(url).then(() => console.log("connected"));

mongoose.connection.on("connected", () => {
  //connected
  console.log("Mongoose is connected");
  // process.exit(1);
});

mongoose.connection.on("disconnected", () => {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", (err) => {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});

app.get("/api/v1/ip", async (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  res.send(ip);
});

app.use("/", todoRouter);
app.use("/", GetClassIdRouter);
app.use("/", FileUpload);

io.on("connection", (socket) => {
  socket.emit("connection", "connected to server")
  console.log(`a user connected ${socket.id}`);
  socket.on("disconnect", (message) => {
    console.log("Client disconnected with id: ", message);
  });
});

server.listen(PORT);

export {io}