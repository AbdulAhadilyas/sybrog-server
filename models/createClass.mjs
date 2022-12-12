import { Schema } from "mongoose";
import mongoose from "mongoose";
const createClass = new Schema({
  className: { type: String, required: true },
  createOn: { type: Date, default: Date.now },
  classData:[
    {
        type:mongoose.Types.ObjectId,
        ref:"ToDos",
    }
  ]
});

const createClassModal = mongoose.model("Class", createClass);
export default createClassModal;
