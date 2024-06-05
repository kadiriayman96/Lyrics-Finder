import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err: any) {
    throw new Error("Error hashing password: " + err.message);
  }
}

export default hashPassword;
