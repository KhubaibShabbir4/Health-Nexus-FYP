import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyEmailToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify token and update user status
    const email = await verifyEmailToken(token);
    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user status to active
    await prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 