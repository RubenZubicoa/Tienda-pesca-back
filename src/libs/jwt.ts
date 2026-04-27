import { User } from "../types/User";
import jwt from 'jsonwebtoken';

export function generateToken(user: User): string {
    const secretKey = process.env.JWT_SECRET || '';
    return jwt.sign({user}, secretKey, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    const secretKey = process.env.JWT_SECRET || '';
    return jwt.verify(token, secretKey);
}