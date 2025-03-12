import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Get the session token from cookies
      const sessionToken = req.cookies.session_token;

      if (sessionToken) {
        // Delete the session from the database
        await prisma.session.deleteMany({
          where: { token: sessionToken },
        });

        // Clear auth-related cookies
        res.setHeader("Set-Cookie", [
          "session_token=; Path=/; HttpOnly; Max-Age=0",
          "authToken=; Path=/; HttpOnly; Max-Age=0",
          "user_role=; Path=/; HttpOnly; Max-Age=0",
        ]);
      }

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ error: "Failed to logout" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export async function GET() {
  try {
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Check if session exists and is valid
    const session = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Valid session'
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    );
  }
}
