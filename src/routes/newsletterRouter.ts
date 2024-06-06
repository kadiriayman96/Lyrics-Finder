import { Router } from "express";
import { newsletter, unsubscribe } from "../controllers/mailController";

const routerMail = Router();

routerMail.post("/", newsletter);
routerMail.post("/unsubscribe", unsubscribe);

export { routerMail };
