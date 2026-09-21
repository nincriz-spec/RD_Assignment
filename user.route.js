//user.route.js
import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured routes --> protected router 
//The protected route uses verifyToken to ensure that only authenticated users can access it.
router.route("/logout").post(verifyJWT, logoutUser); // user can only logout if user is verifyjwt authenticated.

export default router;
