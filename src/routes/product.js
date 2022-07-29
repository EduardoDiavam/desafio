import express from "express";
import controller from "../controllers/product";
const router = express.Router();

router.get("/", controller.get);

export default router;
