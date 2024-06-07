import { Router } from "express";
import { newsletter, unsubscribe } from "../controllers/mailController";
import { validateEmail } from "../middlewares/validationMail"

const routerMail = Router();

routerMail.post("/",validateEmail, newsletter);
routerMail.post("/unsubscribe", unsubscribe);

export { routerMail };
