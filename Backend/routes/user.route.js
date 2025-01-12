import express from "express";
import {login, register, updatePofile} from "../controllers/user.controller.js";
const router = express.Router();

import authenticateToken from "../middleware/isAuthenticated.js";

router.route("/register").post(register);
router.route("./login").post(login);
router.route("./profile/update").post(authenticateToken,updatePofile);

export default router;