import TodoModal from "../models/TodoSchema.mjs";
import express from "express";
import createClassModal from "../models/createClass.mjs";
import { io } from "../server.mjs";
const router = express.Router();

router.post("/api/v1/addItem/:id", async (req, res) => {
  console.log(req.params.id);

  if (!req.body.text || !req.body.ip || !req.body.cType) {
    res.status(400).send("invalid input");
    return;
  }
  try {
    const toDos = new TodoModal({
      text: req.body.text,
      ip: req.body.ip,
      cType: req.body.cType,
      url: req.body.url,
      fileType: req.body.fileType,
    });
    const saveTodo = await toDos.save();
    await createClassModal.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          classData: { $each: [saveTodo._id], $position: 0 },
        },
      },
      { new: true, useFindAndModify: false }
    );
    io.emit(`class-todos`, saveTodo);
    res.status(200);
  } catch (err) {
    res.json(err);
  }
});

router.post("/api/v1/createclass", async (req, res) => {
  if (!req.body.className ) {
    res.status(400).send("invalid input");
    return;
  }
  try {
    const createClass = new createClassModal({
      className: req.body.className,
    });
    const saveTodo = await createClass.save();
    res.status(200).json("item added");
  } catch (err) {
    res.json(err);
  }
});

router.get("/api/v1/getItem/:classname", async (req, res) => {
 
  try {
    const getAllTodo = await createClassModal
      .find({ className: req.params.classname }, function (err, data) {
        if (!data || data.length <= 0) {
          res.status(200).json({ error: "No Class Found" });
          console.log("error");
        } else {
          res.status(200).json(data);
        }
      })
      .clone()
      .sort({ createOn: -1 })
      .populate("classData")
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    res.json(err);
  }
});

router.get("/api/v1/class", async (req, res) => {
  try {
    const getAllTodo = await createClassModal
      .find(function (err, data) {
        if (!data || data.length <= 0) {
          res.status(200).json("No Class Found");
          console.log("error");
        } else {
          res.status(200).json(data);
        }
      })
      .populate("classData")

      .clone()
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    res.json(err);
  }
});

router.put("/api/v1/getItem/:id", async (req, res) => {
  try {
    const upDateTodo = await TodoModal.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("item updated");
  } catch (err) {
    res.json(err);
  }
});

router.delete("/api/v1/delete-one/:classid/:id", async (req, res) => {
  try {
    const classTodos = await createClassModal.findByIdAndUpdate(
      req.params.classid,
      {
        $pullAll: {
          classData: [req.params.id],
        },
      }
    );
    const deleteItem = await TodoModal.findByIdAndDelete(req.params.id);
    res.status(200).json("item deleted");
  } catch (err) {
    res.json(err);
  }
});

router.delete("/api/v1/delete/:classid/:course", async (req, res) => {
  try {
    const classTodos = await createClassModal.findByIdAndUpdate(
      req.params.classid,
      {
        $set: { classData: [] },
      },
      { multi: true }
    );

    const deleteItem = await TodoModal.deleteMany({
      cType: req.params.course,
    });
    res.status(200).json(deleteItem);
  } catch (err) {
    res.json(err);
  }
});

export default router;
