import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, role, fullName, phone, address } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          status: 'PENDING',
          profile: {
            create: {
              fullName,
              phone,
              address,
            },
          },
        },
      });

      // Generate verification token
      const verificationToken = await generateVerificationToken(email);

      return { user, verificationToken };
    });

    // Send verification email
    await sendVerificationEmail(email, result.verificationToken);

    // Return success response (excluding sensitive information)
    const { password: _, ...userData } = result.user;
    return NextResponse.json({
      message: 'Signup successful. Please check your email to verify your account.',
      user: userData,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 