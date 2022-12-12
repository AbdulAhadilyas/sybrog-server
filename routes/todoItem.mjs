import TodoModal from "../models/TodoSchema.mjs";
import express from "express";
import createClassModal from "../models/createClass.mjs";

const router = express.Router();

// router.post("/data/addItem", async (req, res) => {
//   try {
//     const toDos = new TodoModal({
//       text: req.body.text,
//       ip: req.body.ip,
//       cType: req.body.cType,
//     });
//
//     res.status(200).json("item added");
//   } catch (err) {
//     res.json(err);
//   }
// });

router.post("/data/addItem/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const toDos = new TodoModal({
      text: req.body.text,
      ip: req.body.ip,
      cType: req.body.cType,
    });
    const saveTodo = await toDos.save();
    const classTodos = await createClassModal.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          classData: { $each: [saveTodo._id], $position: 0 }
        },
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(classTodos);
  } catch (err) {
    res.json(err);
  }
});

router.post("/data/createclass", async (req, res) => {
  console.log("done");
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

// 

// router.get("/data/getItem", async (req, res) => {
//   try {
//     const getAllTodo = await TodoModal.find(

//       function (err, data) {
//         if (!data || data.length <= 0) {
//           res.status(200).json("No Class Found");
//           console.log("error");
//         } else {
//           res.status(200).json(data);
//         }
//       }
//     ).populate("classData")
//       .clone()
//       .catch(function (err) {
//         console.log(err);
//       });
//   } catch (err) {
//     res.json(err);
//   }
// });

router.get("/data/getItem/:classname", async (req, res) => {
  try {
    const getAllTodo = await createClassModal.find({className:req.params.classname},function (err, data) {
      if (!data || data.length <= 0) {
        res.status(200).json({error:"No Class Found"});
        console.log("error");
      } else {
        res.status(200).json(data);
      }
    })
      .clone()
      .sort({"createOn":-1})
      .populate("classData")
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    res.json(err);
  }
});

router.get("/data/class", async (req, res) => {
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

// router.delete("/data/getItem/delete/:id", async (req, res) => {
//   console.log("done");
//   try {
//     const deleteItem = await TodoModal.findByIdAndDelete(req.params.id);
//     res.status(200).json("item deleted");
//   } catch (err) {
//     res.json(err);
//   }
// });

router.delete("/data/delete/:classid/:objectid", async (req, res) => {
  try {
    const classTodos = await createClassModal.findByIdAndUpdate(
      req.params.classid,
      {
        $pull: {
          classData:req.params.objectid,
        },
      }
    );
    res.status(200).json(classTodos);
  } catch (err) {
    res.json(err);
  }
});

export default router;
