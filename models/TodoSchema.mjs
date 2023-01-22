import { Schema } from "mongoose";
import mongoose from "mongoose";



const TodoSchema = new Schema({
  text: String,
  ip: String,
  url:String,
  createOn: { type: Date, default: Date.now },
  cType: String,
  fileType:String
});




const TodoModal = mongoose.model("ToDos", TodoSchema);
export default TodoModal;
