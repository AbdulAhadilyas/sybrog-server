import { Schema } from "mongoose";
import mongoose from "mongoose";

const TodoSchema = new Schema({
  text: String,
  ip: Number,
  createOn: { type: Date, default: Date.now },
  cType: String,
});

const TodoModal = mongoose.model("ToDos", TodoSchema);
export default TodoModal;
