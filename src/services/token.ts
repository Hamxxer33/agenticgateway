import jwt from 'jsonwebtoken';

export function generateToken(domain: string): string {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  const payload = {
    domain,
    issuedAt: Date.now(),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function validateToken(token: string): boolean {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}