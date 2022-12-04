import { Schema } from "mongoose";
import mongoose from "mongoose";


const classSchema = new Schema({
    classId: {type:String ,required: true}, 
    createOn:{ type: Date, default: Date.now },
  });
  

export default classSchema; 