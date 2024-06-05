import bcrypt from "bcryptjs";

async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const foundPassword = await bcrypt.compare(password, hashedPassword);
  return foundPassword;
}

export default comparePasswords;
