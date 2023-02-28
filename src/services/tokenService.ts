import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string;
}

export const generateToken = (data: any) => {
  const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15h" })
  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "30d" });
  return { accessToken, refreshToken }
}

export const renewToken = (data: any) => {
  const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15h" })
  return accessToken
}

export const decodeToken = async(accessToken: string, refreshToken: string) => {
  let decodedAccessToken
  try {
    decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    return decodedAccessToken
  } catch(err) {
    if(err instanceof jwt.TokenExpiredError) {
      // verify refresh token
      const { id } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, {ignoreExpiration: true} ) as JwtPayload;
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
      if (decodedRefreshToken.id === id) {
        return renewToken(id)
      } else {
        return Error("Could not refresh expired token")
      }
    }
    return err
  }
}
