import { Router } from "express";
import { updatePassword } from "../controllers/passwordController";
import { validatePassword } from "../middlewares/validationAuth";

const routerPassword = Router();

routerPassword.post("/", validatePassword, updatePassword);

export { routerPassword };
