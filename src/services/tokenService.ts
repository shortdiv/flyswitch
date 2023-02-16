import fs from "fs"
import path from "path"
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string;
}

export const generateToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15h" })
}

export const decodeToken = async(token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    var { id } = decoded
    const data = await fs.promises.readFile("./src/data/machines.json", "utf8")
    const jsonified = JSON.parse(data)
    return jsonified[id]
  } catch(err) {
    console.log("this is an error")
    return err
  }
}
