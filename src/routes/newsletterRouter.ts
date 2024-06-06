import { Router } from "express";
import { newsletter } from "../newsletter/mailController";
import { unsubscribe } from "../newsletter/unsubscribe";

const routerMail = Router();

routerMail.post("/newsletter", newsletter);

routerMail.post("/unsubscribe", unsubscribe);

export { routerMail };