import { Router } from "express";
import { loginUser } from "../controllers/authController";
import { register } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middlewares/validationAuth";

const routerAuth = Router();

routerAuth.post("/register", validateRegister, register);
routerAuth.post("/login", validateLogin, loginUser);

export { routerAuth };
