import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/task.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getAll);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
