import express from "express";

const router = express.Router();

router.post("/data/classId/:id", (req, res) => {
  try {
    res.status(200).json(req.params.id);
  } catch (err) {
    res.json(err);
  }
});

export default router;
