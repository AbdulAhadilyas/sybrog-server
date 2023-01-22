import express from "express";

const router = express.Router();

router.post("/api/v1/classId/:id", (req, res) => {
  try {
    res.status(200).json(req.params.id);
  } catch (err) {
    res.json(err);
  }
});

export default router;
                