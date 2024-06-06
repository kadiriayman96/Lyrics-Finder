import cron from 'node-cron';
import Newsletter from '../models/newsletter';
import nodemailer from 'nodemailer';

// Fonction pour envoyer la newsletter
const sendNewsletter = async () => {
  try {
    // Récupérer la liste des emails des abonnés
    const subscribers = await Newsletter.find({}, 'email');
    
    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_host,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_user,
        pass: process.env.SMTP_pass,
      },
    });

    // Options de l'email
    const mailOptions = {
      from: 'apprenant3@talents4startups.com',
      subject: "Découvrez les dernières nouveautés de notre restaurant !",
      text: "merhba bik 3andna 🎂",
    };

    // Envoi de l'email à chaque abonné
    subscribers.forEach(async (subscriber: { email: string }) => {
        const personalMailOptions = {
          ...mailOptions,
          to: subscriber.email,
        };
        await transporter.sendMail(personalMailOptions);
      });

    console.log('Newsletter sent successfully!');
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
};

// Cron job pour envoyer la newsletter chaque semaine (exemple)
cron.schedule('0 0 * * 0', () => {
  sendNewsletter();
}, {
  timezone: 'Europe/Paris', // Optionnel : définir le fuseau horaire
});