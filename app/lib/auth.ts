import  bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword )
}


export const generateJwtToken = (userId: string): string => {
 return jwt.sign({userId}, JWT_SECRET, {expiresIn: "5d"});
}

export const verifyToken = (token: string): { userId: string} => {
 return jwt.verify(token, JWT_SECRET) as  {userId: string};
}

