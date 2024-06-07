import { Router } from "express";
import { updatePassword } from "../controllers/passwordController";

const routerPassword = Router();

routerPassword.post("/", updatePassword);

export { routerPassword };
