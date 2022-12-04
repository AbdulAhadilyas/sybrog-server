import TodoModal from "../models/TodoSchema.mjs";
import express from "express";
import mongoose, { model } from "mongoose";

const router = express.Router();

router.post("/data/addItem", async (req, res) => {
  try {
    const toDos = new TodoModal({
      text: req.body.text,
      ip: req.body.ip,
      cType: req.body.cType,
    });
    const saveTodo = await toDos.save();
    res.status(200).json("item added");
  } catch (err) {
    res.json(err);
  }
});

router.get("/data/getItem/:class", async (req, res) => {
  console.log("helo");
  try {
    const getAllTodo = await TodoModal.find(
      { cType: req.params.class },
      function (err, data) {
        if (!data || data.length <= 0) {
          err = new Error('No docs found in schema ');
        }else{
          res.status(200).json(data);
        }
      }
    );
    
  } catch (err) {
    res.json(err);
  }
});

router.put("/data/getItem/:id", async (req, res) => {
  try {
    const upDateTodo = await TodoModal.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("item updated");
  } catch (err) {
    res.json(err);
  }
});

router.delete("/data/getItem/delete/:id", async (req, res) => {
  try {
    const deleteItem = await TodoModal.findByIdAndDelete(req.params.id);
    res.status(200).json("item deleted");
  } catch (err) {
    res.json(err);
  }
});

export default router;
