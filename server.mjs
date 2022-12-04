import express from "express";
import http from "http"
import todoRouter from "./routes/todoItem.mjs"
import mongoose from "mongoose";
import GetClassIdRouter from "./routes/getClassId.mjs"
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors())

// to create http server
// const server = http.createServer(app)


let port = 8000;

const url =
  "mongodb+srv://ahadilyas:ahadmemon@cluster0.ahq9c1k.mongodb.net/sysBorg?retryWrites=true&w=majority";
await mongoose
  .connect(url)
  .then(() => console.log("connected"));  

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

app.get("/", async (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  res.send(ip);
});

app.use("/" , todoRouter )
app.use("/" , GetClassIdRouter )

app.listen(port);
