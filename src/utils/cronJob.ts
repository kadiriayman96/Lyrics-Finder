import cron from "node-cron";
import nodemailer from "nodemailer";
import Newsletter from "../models/newsletter";
import dotenv from "dotenv";
dotenv.config();

const { SMTP_host, SMTP_user, SMTP_pass } = process.env;

// Fonction pour envoyer la newsletter
const sendNewsletterCronJob = async () => {
  try {
    // Récupérer la liste des emails des abonnés
    const subscribers = await Newsletter.find({}, "email");

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: SMTP_host,
      port: 465,
      secure: true,
      auth: {
        user: SMTP_user,
        pass: SMTP_pass,
      },
    });

    // Options de l'email
    const mailOptions = {
      from: "apprenant3@talents4startups.com",
      subject: "Découvrez les dernières nouveautés des artistes !",
      text: "Welcome to Lyrics Finder 🎂",
    };

    // Envoi de l'email à chaque abonné
    subscribers.forEach(async (subscriber: { email: string }) => {
      const personalMailOptions = {
        ...mailOptions,
        to: subscriber.email,
      };
      await transporter.sendMail(personalMailOptions);
    });

    console.log("Newsletter sent successfully!");
  } catch (error) {
    console.error("Error sending newsletter:", error);
  }
};

export default sendNewsletterCronJob;
