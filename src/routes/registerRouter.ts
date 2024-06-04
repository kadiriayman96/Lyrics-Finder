import { Router } from "express";
import { register  } from "../controllers/registerController";


const routerRegister = Router();

routerRegister.post("/register", register);


export { routerRegister };
