import jwt from "jsonwebtoken";

function generateToken(payload: any, user_key: string): string {
  const token = jwt.sign(payload, user_key, {
    expiresIn: "3d",
  });

  return token;
}

export default generateToken;
