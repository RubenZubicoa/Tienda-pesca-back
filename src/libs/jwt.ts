import jwt from 'jsonwebtoken';

export function generateToken(user: unknown): string {
    const secretKey = process.env.JWT_SECRET || '';
    return jwt.sign({user}, secretKey, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    const secretKey = process.env.JWT_SECRET || '';
    return jwt.verify(token, secretKey);
}