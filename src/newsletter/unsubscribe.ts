import { Request, Response } from "express";
import Newsletter from "../models/newsletter";

export const unsubscribe = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Recherche de l'email dans la base de données
    const subscriber = await Newsletter.findOne({ email });

    // Si l'email n'est pas trouvé, renvoyer une erreur
    if (!subscriber) {
      return res.status(404).json({ error: "Email not found in subscribers list" });
    }

    // Suppression de l'email de la base de données
    await subscriber.deleteOne();

    res.status(200).json({ message: "Successfully unsubscribed from newsletter" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
