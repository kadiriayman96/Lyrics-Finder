import { Request, Response } from "express";
import Newsletter from "../models/newsletter";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SMTP_host, SMTP_user, SMTP_pass } = process.env;

const newsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existEmail = await Newsletter.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists in the database" });
    }
    const newNewsletter = new Newsletter({
      email: email,
      subscribedAt: new Date(),
    });
    await newNewsletter.save();

    const transporter = nodemailer.createTransport({
      host: SMTP_host,
      port: 465,
      secure: true,
      auth: {
        user: SMTP_user,
        pass: SMTP_pass,
      },
    });

    const mailOptions = {
      from: "apprenant.apprenant4@talents4starups.com",
      to: email,
      subject: "Découvrez les dernières nouveautés des artistes !",
      text: "Welcome to Lyrics Finder 🎂",
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res
      .status(200)
      .json({ message: "Email sent successfully to " + email });
  } catch (error) {
    console.error("Error creating newsletter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Recherche de l'email dans la base de données
    const subscriber = await Newsletter.findOne({ email });

    // Si l'email n'est pas trouvé, renvoyer une erreur
    if (!subscriber) {
      return res
        .status(404)
        .json({ error: "Email not found in subscribers list" });
    }

    // Suppression de l'email de la base de données
    await subscriber.deleteOne();

    res
      .status(200)
      .json({ message: "Successfully unsubscribed from newsletter" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { newsletter, unsubscribe };
