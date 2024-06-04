import { Router } from "express";
import { register  } from "../controllers/registerController";


const routerLogin = Router();

routerLogin.post("/login", register);


export { routerLogin };
