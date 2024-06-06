import { Request, Response } from "express";
import Newsletter from "../models/newsletter";
const nodemailer = require('nodemailer');

export const newsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const newNewsletter = new Newsletter({
      email: email,
      subscribedAt: new Date()
    });
    await newNewsletter.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_host,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.SMTP_user,
        pass: process.env.SMTP_pass,
      },
    });
    console.log("env: SMTP_host ", process.env.SMTP_host);
    console.log("env: SMTP_user ", process.env.SMTP_user);
    console.log("env: SMTP_pass ", process.env.SMTP_pass);

    const mailOptions = {
      from: "apprenant3@talents4startups.com",
      to: email, 
      subject: "Découvrez les dernières nouveautés de notre restaurant !",
      text: "merhba bik 3andna 🎂",
    };

    transporter.sendMail(mailOptions, function(error: any, info: any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log("1");
    res.redirect('/');
  } catch (error) {
    console.error("Error creating newsletter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};