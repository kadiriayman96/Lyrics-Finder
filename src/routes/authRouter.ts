import { Router } from "express";
import { loginUser } from "../controllers/authController";
import { register } from "../controllers/authController";

const routerAuth = Router();

routerAuth.post("/register", register);
routerAuth.post("/login", loginUser);

export { routerAuth };
