import jwt from "jsonwebtoken"

export const generateToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15h" })
}