import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Generate access token
export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

// Generate refresh token
export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

// Verify access token
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

// Verify refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Set cookies
export function setAuthCookies(accessToken, refreshToken) {
  // Set access token cookie
  cookies().set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
  });

  // Set refresh token cookie
  cookies().set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Remove cookies
export function removeAuthCookies() {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
}

// Get user from token
export async function getUserFromToken(token) {
  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

// Create session
export async function createSession(userId, token) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

  return prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

// Create refresh token
export async function createRefreshToken(userId, token) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  return prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

// Verify session
export async function verifySession(token) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}

// Verify refresh token
export async function verifyRefreshTokenDB(token) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken || refreshToken.expiresAt < new Date()) {
    return null;
  }

  return refreshToken;
}

// Clean up expired sessions and refresh tokens
export async function cleanupExpiredTokens() {
  const now = new Date();

  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}

// Generate verification token
export async function generateVerificationToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return token;
}

// Verify email token
export async function verifyEmailToken(token) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return null;
  }

  // Update user email verification status
  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: true },
  });

  // Delete used token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return verificationToken.email;
} 