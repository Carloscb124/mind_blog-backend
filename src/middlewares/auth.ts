import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { json } from "stream/consumers";

export interface AuthRequest extends Request {
    userId?: number;
}

interface JwtPayload {
    id: number
}
 export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
):  void  {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não fornecido"})
    return;
}

    const token = authHeader.split(" ")[1];

    try{
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch{
        res.status(401).json({ message: "Token inválidado ou expirado"})
    }
}
