import { Router } from "express";
import { login  } from "../controllers/authController";


const routerLogin = Router();

routerLogin.post("/login", login);


export { routerLogin };
