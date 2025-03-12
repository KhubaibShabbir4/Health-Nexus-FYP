import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyRefreshTokenDB, generateAccessToken, createSession, createRefreshToken, setAuthCookies } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const refreshTokenData = await verifyRefreshTokenDB(refreshToken);
    if (!refreshTokenData) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken(refreshTokenData.user);

    // Create new session
    await createSession(refreshTokenData.userId, accessToken);

    // Generate new refresh token
    const newRefreshToken = await createRefreshToken(refreshTokenData.userId);

    // Set new cookies
    setAuthCookies(accessToken, newRefreshToken.token);

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: refreshTokenData.id },
    });

    return NextResponse.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 