import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/usersController";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const routerUsers = Router();

routerUsers.use(verifyToken);
routerUsers.get("/", getAllUsers);
routerUsers.put("/updateUserRole/:_id", updateUserRole);
routerUsers.delete("/deleteUser/:_id", deleteUser);

export { routerUsers };
